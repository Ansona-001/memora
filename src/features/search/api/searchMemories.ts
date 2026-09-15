import { tagToPrompt } from "@/features/ai/config/aiConfig";
import { getSharedAiClient } from "@/features/ai/services/aiClient";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

const RESULT_LIMIT = 60;

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1)
    .slice(0, 10);
}

// Semantic search is a nice-to-have layer on top of keyword search. It must
// never make search feel broken or stuck: an unavailable/slow model, a
// disabled AI preference, or an unapplied ai_embedding migration should
// never block (or even visibly delay) the fast keyword results. The first
// call in a session may need to load the CLIP model (several seconds), so
// this is bounded — if it doesn't finish quickly, keyword results still
// return on time and the semantic layer is simply absent for that search.
const SEMANTIC_SEARCH_TIMEOUT_MS = 3000;

// Empirically measured (live queries against the real photo library, not
// guessed): with search queries wrapped in the same "a photo of {query}"
// template used for tag embeddings, a nonsense query ("asdf") topped out at
// 0.230 cosine similarity — CLIP's baseline noise floor for unrelated
// text/image pairs is well above 0. Real queries ("wedding", "family")
// scored 0.245-0.294 at the top end. 0.24 sits above the measured noise
// ceiling; re-measure as the library grows (same caveat as
// TAG_SIMILARITY_THRESHOLD — the noise ceiling itself shifted up when this
// was re-measured against more photos than the first pass).
const SEMANTIC_MATCH_THRESHOLD = 0.24;

async function semanticMatches(
  coupleSpaceId: string,
  query: string,
  aiEnabled: boolean,
): Promise<Memory[]> {
  if (!aiEnabled) {
    return [];
  }

  try {
    // Tag vocabulary embeddings are computed from "a photo of {tag}" (see
    // ai.worker.ts), not the bare word — comparing a raw query against
    // those needs the same template, or the two live in slightly different
    // regions of the embedding space and similarity scores get noisier.
    const embedding = await withTimeout(
      getSharedAiClient().embedQuery(tagToPrompt(query)),
      SEMANTIC_SEARCH_TIMEOUT_MS,
    );
    if (!embedding) {
      return [];
    }

    const { data, error } = await supabase.rpc("match_memories", {
      query_embedding: embedding,
      match_couple_space_id: coupleSpaceId,
      match_threshold: SEMANTIC_MATCH_THRESHOLD,
      match_count: 20,
    });

    if (error || !data || data.length === 0) {
      return [];
    }

    const { data: fullRows, error: fullError } = await supabase
      .from("memories")
      .select("*")
      .in(
        "id",
        data.map((row) => row.id),
      );

    return fullError ? [] : (fullRows ?? []);
  } catch {
    return [];
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

export async function searchMemories(
  coupleSpaceId: string,
  query: string,
  aiEnabled: boolean,
): Promise<Memory[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const pattern = `%${trimmed}%`;
  const tokens = tokenizeQuery(trimmed);

  const titleMatches = supabase
    .from("memories")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .ilike("title", pattern)
    .order("captured_at", { ascending: false })
    .limit(RESULT_LIMIT);

  const captionMatches = supabase
    .from("memories")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .ilike("ai_caption", pattern)
    .order("captured_at", { ascending: false })
    .limit(RESULT_LIMIT);

  const tagMatches = tokens.length
    ? supabase
        .from("memories")
        .select("*")
        .eq("couple_space_id", coupleSpaceId)
        .overlaps("ai_tags", tokens)
        .order("captured_at", { ascending: false })
        .limit(RESULT_LIMIT)
    : null;

  const [titleResult, captionResult, tagResult, semanticData] =
    await Promise.all([
      titleMatches,
      captionMatches,
      tagMatches,
      semanticMatches(coupleSpaceId, trimmed, aiEnabled),
    ]);

  if (titleResult.error) {
    throw titleResult.error;
  }

  const captionData = isMissingColumnError(captionResult?.error)
    ? []
    : throwIfError(captionResult);

  const tagData = tagResult
    ? isMissingColumnError(tagResult.error)
      ? []
      : throwIfError(tagResult)
    : [];

  const merged = new Map<string, Memory>();
  for (const memory of [
    ...semanticData,
    ...tagData,
    ...captionData,
    ...(titleResult.data ?? []),
  ]) {
    merged.set(memory.id, memory);
  }

  return [...merged.values()]
    .sort((a, b) => b.captured_at.localeCompare(a.captured_at))
    .slice(0, RESULT_LIMIT);
}

function isMissingColumnError(error: { message?: string; code?: string } | null): boolean {
  if (!error) {
    return false;
  }

  const message =
    typeof error.message === "string" ? error.message.toLowerCase() : "";
  return (
    error.code === "PGRST204" ||
    message.includes("ai_caption") ||
    message.includes("ai_tags") ||
    message.includes("schema cache")
  );
}

function throwIfError<TData>(
  result: { data: TData | null; error: { message: string } | null },
): NonNullable<TData> {
  if (result.error) {
    throw result.error;
  }

  return (result.data ?? []) as NonNullable<TData>;
}
