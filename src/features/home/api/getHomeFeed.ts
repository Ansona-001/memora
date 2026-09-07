import {
  getAlbums,
  type AlbumWithCount,
} from "@/features/albums/api/getAlbums";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export interface HomeFeed {
  featured: Memory | null;
  continueWatching: Memory[];
  recentMemories: Memory[];
  favoriteMemories: Memory[];
  albums: AlbumWithCount[];
  videoMemories: Memory[];
  historicalMemories: Memory[];
}

const ROW_LIMIT = 12;
const ON_THIS_DAY_WINDOW_DAYS = 3;
const MIN_PROGRESS_SECONDS = 5;
const NEAR_END_RATIO = 0.95;

export async function getHomeFeed(
  coupleSpaceId: string,
  userId: string,
): Promise<HomeFeed> {
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const windowStart = new Date(lastYear);
  windowStart.setDate(lastYear.getDate() - ON_THIS_DAY_WINDOW_DAYS);
  const windowEnd = new Date(lastYear);
  windowEnd.setDate(lastYear.getDate() + ON_THIS_DAY_WINDOW_DAYS);

  const [recent, favorites, videos, historical, inProgress, albums] =
    await Promise.all([
      supabase
        .from("memories")
        .select("*")
        .eq("couple_space_id", coupleSpaceId)
        .order("created_at", { ascending: false })
        .limit(ROW_LIMIT),
      supabase
        .from("memories")
        .select("*")
        .eq("couple_space_id", coupleSpaceId)
        .eq("is_favorite", true)
        .order("created_at", { ascending: false })
        .limit(ROW_LIMIT),
      supabase
        .from("memories")
        .select("*")
        .eq("couple_space_id", coupleSpaceId)
        .eq("media_type", "video")
        .order("created_at", { ascending: false })
        .limit(ROW_LIMIT),
      supabase
        .from("memories")
        .select("*")
        .eq("couple_space_id", coupleSpaceId)
        .gte("captured_at", windowStart.toISOString())
        .lte("captured_at", windowEnd.toISOString())
        .order("captured_at", { ascending: false })
        .limit(ROW_LIMIT),
      supabase
        .from("playback_progress")
        .select(
          "position_seconds, duration_seconds, updated_at, memory:memories(*)",
        )
        .eq("couple_space_id", coupleSpaceId)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(ROW_LIMIT),
      getAlbums(coupleSpaceId),
    ]);

  if (recent.error) throw recent.error;
  if (favorites.error) throw favorites.error;
  if (videos.error) throw videos.error;
  if (historical.error) throw historical.error;
  if (inProgress.error) throw inProgress.error;

  const continueWatching = inProgress.data
    .filter(
      (row) =>
        row.memory &&
        row.position_seconds >= MIN_PROGRESS_SECONDS &&
        row.position_seconds < row.duration_seconds * NEAR_END_RATIO,
    )
    .map((row) => row.memory as Memory);

  return {
    featured: recent.data[0] ?? null,
    continueWatching,
    recentMemories: recent.data,
    favoriteMemories: favorites.data,
    albums,
    videoMemories: videos.data,
    historicalMemories: historical.data,
  };
}
