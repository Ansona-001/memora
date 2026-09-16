-- Public album sharing: a couple can mark individual albums public, at
-- which point they (and their memories) become visible with no login at
-- /{public_slug}/{album_id}. Access control is entirely "is this album
-- currently marked public" — no separate secret token, no expiry, by
-- explicit product decision. Anyone with the couple's public_slug can see
-- whichever albums are currently toggled on; toggling off immediately
-- revokes access for that album.

-- 1. Per-album visibility toggle.
alter table public.albums
  add column if not exists is_public boolean not null default false;

-- 2. Couple-level public handle (e.g. "alex-and-sam"), auto-generated from
--    the couple space name and editable afterward in Settings.
alter table public.couple_spaces
  add column if not exists public_slug text unique;

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(trim(input)), '[^a-z0-9]+', '-', 'g'));
$$;

-- Route segments a slug must never collide with, since public couple pages
-- live at the bare top-level path (memora.app/{slug}), a sibling of the
-- app's other top-level routes.
create or replace function public.is_reserved_slug(candidate text)
returns boolean
language sql
immutable
as $$
  select candidate in (
    'app', 'login', 'register', 'couple', 'splash', 'onboarding',
    'forgot-password', 'reset-password'
  );
$$;

alter table public.couple_spaces
  add constraint couple_spaces_public_slug_not_reserved
  check (public_slug is null or not public.is_reserved_slug(public_slug));

create function public.generate_couple_space_slug()
returns trigger
language plpgsql
as $$
declare
  v_base text;
  v_candidate text;
begin
  if new.public_slug is not null then
    return new;
  end if;

  v_base := public.slugify(coalesce(new.name, 'our-space'));
  if v_base = '' or public.is_reserved_slug(v_base) then
    v_base := 'space';
  end if;

  v_candidate := v_base;
  while exists (select 1 from public.couple_spaces where public_slug = v_candidate) loop
    v_candidate := v_base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
  end loop;

  new.public_slug := v_candidate;
  return new;
end;
$$;

create trigger set_couple_space_slug
  before insert on public.couple_spaces
  for each row
  execute function public.generate_couple_space_slug();

-- Backfill a slug for any couple space that predates this migration, using
-- the same "try the clean name first, fall back to a random suffix only on
-- collision" logic as the trigger above (not just always appending a
-- suffix), so pre-existing rows get the same clean slugs a fresh insert
-- would.
do $$
declare
  v_row record;
  v_base text;
  v_candidate text;
begin
  for v_row in select id, name from public.couple_spaces where public_slug is null loop
    v_base := public.slugify(coalesce(v_row.name, 'our-space'));
    if v_base = '' or public.is_reserved_slug(v_base) then
      v_base := 'space';
    end if;

    v_candidate := v_base;
    while exists (select 1 from public.couple_spaces where public_slug = v_candidate) loop
      v_candidate := v_base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
    end loop;

    update public.couple_spaces set public_slug = v_candidate where id = v_row.id;
  end loop;
end;
$$;

-- 3. Public read access — scoped strictly to rows that are currently
--    public, alongside (not replacing) the existing member-only policies.

-- A couple space is only publicly visible once it has at least one public
-- album; a slug existing is not itself proof anyone has chosen to share
-- anything.
create policy "Public can view couple spaces with a public album"
  on public.couple_spaces for select
  using (
    exists (
      select 1 from public.albums
      where albums.couple_space_id = couple_spaces.id and albums.is_public = true
    )
  );

create policy "Public can view public albums"
  on public.albums for select
  using (is_public = true);

create policy "Public can view memories in public albums"
  on public.memories for select
  using (
    exists (
      select 1 from public.albums
      where albums.id = memories.album_id and albums.is_public = true
    )
  );

create policy "Public can view media for public albums"
  on storage.objects for select
  using (
    bucket_id = 'memory-media'
    and exists (
      select 1 from public.memories
      join public.albums on albums.id = memories.album_id
      where memories.storage_path = storage.objects.name
        and albums.is_public = true
    )
  );

create policy "Public can view thumbnails for public albums"
  on storage.objects for select
  using (
    bucket_id = 'memory-thumbnails'
    and exists (
      select 1 from public.memories
      join public.albums on albums.id = memories.album_id
      where memories.thumbnail_path = storage.objects.name
        and albums.is_public = true
    )
  );

-- 4. Comments on public albums — no login required to read or post,
--    matching the album's own access model; only the couple can moderate.
create table public.album_comments (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index album_comments_album_id_idx on public.album_comments (album_id);

alter table public.album_comments enable row level security;

create policy "Public can view comments on public albums"
  on public.album_comments for select
  using (
    exists (
      select 1 from public.albums
      where albums.id = album_comments.album_id and albums.is_public = true
    )
  );

create policy "Public can comment on public albums"
  on public.album_comments for insert
  with check (
    exists (
      select 1 from public.albums
      where albums.id = album_comments.album_id and albums.is_public = true
    )
    and length(trim(author_name)) > 0
    and length(author_name) <= 80
    and length(trim(body)) > 0
    and length(body) <= 2000
  );

create policy "Couple members can delete comments on their albums"
  on public.album_comments for delete
  using (
    exists (
      select 1 from public.albums
      where albums.id = album_comments.album_id
        and public.is_couple_member(albums.couple_space_id)
    )
  );
