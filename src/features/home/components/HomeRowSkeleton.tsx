import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export function HomeRowSkeleton() {
  return (
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={160} height={32} sx={{ mb: 1.5 }} />
      <Box sx={{ display: "flex", gap: 2 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={200}
            height={125}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>
    </Box>
  );
}
