-- Memories: the individual photos and videos a couple uploads.
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  media_type text not null check (media_type in ('photo', 'video')),
  storage_path text not null,
  thumbnail_path text not null,
  file_size_bytes bigint not null,
  width int,
  height int,
  duration_seconds numeric,
  title text,
  is_favorite boolean not null default false,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memories_couple_space_id_idx on public.memories (couple_space_id);
create index memories_couple_space_captured_at_idx
  on public.memories (couple_space_id, captured_at desc);

alter table public.memories enable row level security;

create policy "Couple members can view their memories"
  on public.memories for select
  using (public.is_couple_member(couple_space_id));

create policy "Couple members can add memories"
  on public.memories for insert
  with check (
    public.is_couple_member(couple_space_id)
    and created_by = auth.uid()
  );

create policy "Couple members can update their memories"
  on public.memories for update
  using (public.is_couple_member(couple_space_id))
  with check (public.is_couple_member(couple_space_id));

create policy "Couple members can delete their memories"
  on public.memories for delete
  using (public.is_couple_member(couple_space_id));

create trigger set_memories_updated_at
  before update on public.memories
  for each row
  execute function public.set_updated_at();

-- Private storage buckets for uploaded media.
insert into storage.buckets (id, name, public)
values
  ('memory-media', 'memory-media', false),
  ('memory-thumbnails', 'memory-thumbnails', false);

-- Object paths are "{bucket}/{coupleSpaceId}/...", so the first path
-- segment is the couple space id membership is checked against.
create policy "Couple members can manage their memory media objects"
  on storage.objects for all
  using (
    bucket_id = 'memory-media'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'memory-media'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  );

create policy "Couple members can manage their memory thumbnail objects"
  on storage.objects for all
  using (
    bucket_id = 'memory-thumbnails'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'memory-thumbnails'
    and public.is_couple_member(((storage.foldername(name))[1])::uuid)
  );
