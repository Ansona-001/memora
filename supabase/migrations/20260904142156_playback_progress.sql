-- Per-user video resume points. Each partner watches independently, so
-- progress is scoped to (memory, user), not shared across the couple.
create table public.playback_progress (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces (id) on delete cascade,
  memory_id uuid not null references public.memories (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  position_seconds numeric not null,
  duration_seconds numeric not null,
  updated_at timestamptz not null default now(),
  unique (memory_id, user_id)
);

create index playback_progress_user_id_idx on public.playback_progress (user_id);

alter table public.playback_progress enable row level security;

create policy "Users can view their own playback progress"
  on public.playback_progress for select
  using (user_id = auth.uid());

create policy "Users can save their own playback progress"
  on public.playback_progress for insert
  with check (
    user_id = auth.uid()
    and public.is_couple_member(couple_space_id)
  );

create policy "Users can update their own playback progress"
  on public.playback_progress for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own playback progress"
  on public.playback_progress for delete
  using (user_id = auth.uid());

create trigger set_playback_progress_updated_at
  before update on public.playback_progress
  for each row
  execute function public.set_updated_at();
