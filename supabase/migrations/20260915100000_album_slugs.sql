-- Public album URLs should read as /{couple-slug}/{album-title}, not a raw
-- UUID. Slugs are unique per couple space (not globally), since the full
-- path already disambiguates via the couple slug.
alter table public.albums add column if not exists slug text;

create function public.generate_album_slug()
returns trigger
language plpgsql
as $$
declare
  v_base text;
  v_candidate text;
begin
  if new.slug is not null then
    return new;
  end if;

  v_base := public.slugify(coalesce(new.title, 'album'));
  if v_base = '' then
    v_base := 'album';
  end if;

  v_candidate := v_base;
  while exists (
    select 1 from public.albums
    where couple_space_id = new.couple_space_id and slug = v_candidate
  ) loop
    v_candidate := v_base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
  end loop;

  new.slug := v_candidate;
  return new;
end;
$$;

create trigger set_album_slug
  before insert on public.albums
  for each row
  execute function public.generate_album_slug();

-- Backfill existing albums, same "try the clean title first" logic.
do $$
declare
  v_row record;
  v_base text;
  v_candidate text;
begin
  for v_row in select id, couple_space_id, title from public.albums where slug is null loop
    v_base := public.slugify(coalesce(v_row.title, 'album'));
    if v_base = '' then
      v_base := 'album';
    end if;

    v_candidate := v_base;
    while exists (
      select 1 from public.albums
      where couple_space_id = v_row.couple_space_id and slug = v_candidate
    ) loop
      v_candidate := v_base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 4);
    end loop;

    update public.albums set slug = v_candidate where id = v_row.id;
  end loop;
end;
$$;

alter table public.albums alter column slug set not null;
create unique index albums_couple_space_id_slug_idx on public.albums (couple_space_id, slug);
