-- CLIP tagging + semantic search: adds embedding storage on top of the
-- existing ai_caption / ai_tags columns. ai_caption is no longer written by
-- the pipeline (CLIP is a zero-shot tagger, not a captioner) but stays as a
-- manually-editable field.
create extension if not exists vector;

alter table public.memories
  add column if not exists ai_embedding vector(512),
  add column if not exists ai_model_version text;

-- ivfflat needs a rough row-count estimate for `lists`; 100 is a reasonable
-- default for a per-couple-space library size (low thousands of rows).
-- Re-tune if a couple's library grows into the tens of thousands.
create index if not exists memories_ai_embedding_idx
  on public.memories
  using ivfflat (ai_embedding vector_cosine_ops)
  with (lists = 100);

-- Scoped to a couple space and NOT security definer, so RLS on `memories`
-- still applies (runs as the calling user).
create or replace function public.match_memories(
  query_embedding vector(512),
  match_couple_space_id uuid,
  match_threshold float default 0.24,
  match_count int default 20
)
returns table (
  id uuid,
  title text,
  ai_caption text,
  ai_tags text[],
  similarity float
)
language sql
stable
as $$
  select
    m.id,
    m.title,
    m.ai_caption,
    m.ai_tags,
    1 - (m.ai_embedding <=> query_embedding) as similarity
  from public.memories m
  where m.couple_space_id = match_couple_space_id
    and m.ai_embedding is not null
    and 1 - (m.ai_embedding <=> query_embedding) > match_threshold
  order by m.ai_embedding <=> query_embedding
  limit match_count;
$$;
