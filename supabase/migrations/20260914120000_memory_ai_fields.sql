-- Free on-device AI: store the caption/tags generated locally so search,
-- timeline, and recaps can use them without any paid API.
alter table public.memories
  add column if not exists ai_caption text,
  add column if not exists ai_tags text[] not null default '{}';

create index if not exists memories_ai_tags_idx
  on public.memories using gin (ai_tags);
