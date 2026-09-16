import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";

import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

import { PublicMediaViewer } from "./PublicMediaViewer";

interface PublicMediaGridProps {
  memories: Memory[];
}

export function PublicMediaGrid({ memories }: PublicMediaGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1.5,
        }}
      >
        {memories.map((memory, index) => {
          const label =
            memory.title ??
            `${memory.media_type === "video" ? "Video" : "Photo"} from ${dayjs(memory.captured_at).format("MMMM D, YYYY")}`;

          return (
            <Box
              key={memory.id}
              role="button"
              tabIndex={0}
              aria-label={label}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedIndex(index);
                }
              }}
              sx={{ cursor: "pointer" }}
            >
              <MemoryThumbnail memory={memory} aspectRatio="1 / 1" />
            </Box>
          );
        })}
      </Box>

      {selectedIndex !== null ? (
        <PublicMediaViewer
          memory={memories[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={
            selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null
          }
          onNext={
            selectedIndex < memories.length - 1
              ? () => setSelectedIndex(selectedIndex + 1)
              : null
          }
        />
      ) : null}
    </>
  );
}
