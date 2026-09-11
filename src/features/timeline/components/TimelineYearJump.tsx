import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

interface TimelineYearJumpProps {
  years: number[];
  onJump: (year: number) => void;
}

export function TimelineYearJump({ years, onJump }: TimelineYearJumpProps) {
  if (years.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 1,
        mb: 2,
      }}
    >
      {years.map((year) => (
        <Chip
          key={year}
          label={year}
          clickable
          onClick={() => onJump(year)}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
}
