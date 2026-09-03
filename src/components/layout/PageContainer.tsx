import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: "1400px",
        width: "100%",
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      {children}
    </Box>
  );
}
