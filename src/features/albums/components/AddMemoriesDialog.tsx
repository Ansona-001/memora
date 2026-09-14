import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { useState } from "react";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

interface AddMemoriesDialogProps {
  open: boolean;
  memories: Memory[];
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (memoryIds: string[]) => void;
}

export function AddMemoriesDialog({
  open,
  memories,
  isSubmitting,
  onClose,
  onConfirm,
}: AddMemoriesDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const handleClose = () => {
    setSelectedIds([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add memories</DialogTitle>
      <DialogContent>
        {memories.length === 0 ? (
          <EmptyState
            title="No unassigned memories"
            description="Upload new photos or videos, or remove one from another album first."
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 1.5,
            }}
          >
            {memories.map((memory) => {
              const isSelected = selectedIds.includes(memory.id);
              return (
                <Box
                  key={memory.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={
                    memory.title ??
                    `${memory.media_type === "video" ? "Video" : "Photo"} from ${dayjs(memory.captured_at).format("MMMM D, YYYY")}`
                  }
                  onClick={() => toggle(memory.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      toggle(memory.id);
                    }
                  }}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    outline: isSelected ? "3px solid" : "none",
                    outlineColor: "primary.main",
                    borderRadius: 2,
                  }}
                >
                  <MemoryThumbnail memory={memory} aspectRatio="1 / 1" />
                  {isSelected ? (
                    <CheckCircleRoundedIcon
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "background.default",
                        borderRadius: "50%",
                      }}
                    />
                  ) : null}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
        <PrimaryButton
          disabled={selectedIds.length === 0}
          isLoading={isSubmitting}
          onClick={() => onConfirm(selectedIds)}
        >
          Add {selectedIds.length > 0 ? selectedIds.length : ""} memories
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
