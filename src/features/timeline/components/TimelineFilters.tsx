import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import type { TimelineMediaFilter } from "../api/getTimelineMemories";

interface TimelineFiltersProps {
  value: TimelineMediaFilter;
  onChange: (value: TimelineMediaFilter) => void;
}

const OPTIONS: { value: TimelineMediaFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "favorite", label: "Favorites" },
];

export function TimelineFilters({ value, onChange }: TimelineFiltersProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={(_event, next: TimelineMediaFilter | null) => {
        if (next) {
          onChange(next);
        }
      }}
    >
      {OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
