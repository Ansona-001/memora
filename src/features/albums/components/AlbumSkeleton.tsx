import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export function AlbumSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", aspectRatio: "4 / 3" }}
      />
      <Skeleton variant="text" width="70%" sx={{ mt: 1 }} />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}
