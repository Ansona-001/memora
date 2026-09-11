import dayjs from "dayjs";

import type { Memory } from "@/types/media";

export interface MonthGroup {
  key: string;
  monthLabel: string;
  memories: Memory[];
}

export interface YearGroup {
  year: number;
  months: MonthGroup[];
}

/**
 * Groups memories (already ordered newest first) into year -> month
 * buckets for the timeline view, preserving that order.
 */
export function groupMemoriesByDate(memories: Memory[]): YearGroup[] {
  const yearMap = new Map<number, Map<string, MonthGroup>>();

  for (const memory of memories) {
    const date = dayjs(memory.captured_at);
    const year = date.year();
    const monthKey = date.format("YYYY-MM");

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map());
    }
    const monthMap = yearMap.get(year)!;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        key: monthKey,
        monthLabel: date.format("MMMM"),
        memories: [],
      });
    }
    monthMap.get(monthKey)!.memories.push(memory);
  }

  return Array.from(yearMap.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.values()),
    }));
}
