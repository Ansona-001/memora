import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { UPLOAD_LIMITS } from "@/config/uploadLimits";

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
}

const ACCEPTED_TYPES = [
  ...UPLOAD_LIMITS.acceptedPhotoTypes,
  ...UPLOAD_LIMITS.acceptedVideoTypes,
].join(",");

export function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
    if (event.dataTransfer.files.length > 0) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected(event.target.files);
    }
    event.target.value = "";
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 6,
        px: 3,
        border: "2px dashed",
        borderColor: isDraggingOver ? "primary.main" : "divider",
        borderRadius: 3,
        backgroundColor: isDraggingOver ? "action.hover" : "background.paper",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <CloudUploadRoundedIcon sx={{ fontSize: 40, color: "primary.main" }} />
      <Typography variant="body1">
        Drag and drop photos or videos here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse your files
      </Typography>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </Box>
  );
}
