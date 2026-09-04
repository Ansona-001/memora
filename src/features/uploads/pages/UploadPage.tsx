import Typography from "@mui/material/Typography";

import { PageContainer } from "@/components/layout/PageContainer";

import { UploadDropzone } from "../components/UploadDropzone";
import { UploadQueueList } from "../components/UploadQueueList";
import { useUploadQueue } from "../hooks/useUploadQueue";

export function UploadPage() {
  const { items, addFiles, retryItem, removeItem, clearCompleted } =
    useUploadQueue();

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Upload memories
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Photos and videos are compressed and stored privately in your couple
        space.
      </Typography>

      <UploadDropzone onFilesSelected={addFiles} />

      <UploadQueueList
        items={items}
        onRetry={retryItem}
        onRemove={removeItem}
        onClearCompleted={clearCompleted}
      />
    </PageContainer>
  );
}
