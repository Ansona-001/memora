-- Albums: named collections of memories within a couple space.
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  title text not null,
  description text,
  cover_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index albums_couple_space_id_idx on public.albums (couple_space_id);

alter table public.albums enable row level security;

create policy "Couple members can view their albums"
  on public.albums for select
  using (public.is_couple_member(couple_space_id));

create policy "Couple members can create albums"
  on public.albums for insert
  with check (
    public.is_couple_member(couple_space_id)
    and created_by = auth.uid()
  );

create policy "Couple members can update their albums"
  on public.albums for update
  using (public.is_couple_member(couple_space_id))
  with check (public.is_couple_member(couple_space_id));

create policy "Couple members can delete their albums"
  on public.albums for delete
  using (public.is_couple_member(couple_space_id));

create trigger set_albums_updated_at
  before update on public.albums
  for each row
  execute function public.set_updated_at();

-- A memory belongs to at most one album at a time.
alter table public.memories
  add column album_id uuid references public.albums (id) on delete set null;

create index memories_album_id_idx on public.memories (album_id);

-- Private storage bucket for custom album cover images.
insert into storage.buckets (id, name, public)
values ('album-covers', 'album-covers', false);

create policy "Couple members can manage their album cover objects"
  on storage.objects for all
  using (
    bucket_id = 'album-covers'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'album-covers'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  );
