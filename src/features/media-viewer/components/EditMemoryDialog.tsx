import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import type { Memory } from "@/types/media";

import { memorySchema, type MemoryFormValues } from "../schemas/memorySchema";

interface EditMemoryDialogProps {
  open: boolean;
  memory: Memory;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (values: MemoryFormValues) => void;
}

export function EditMemoryDialog({
  open,
  memory,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EditMemoryDialogProps) {
  const methods = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    values: { title: memory.title ?? "" },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit memory</DialogTitle>
      <FormProvider {...methods}>
        <Stack
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          spacing={2}
        >
          <DialogContent>
            {errorMessage ? (
              <AppAlert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </AppAlert>
            ) : null}
            <FormTextField<MemoryFormValues>
              name="title"
              label="Title (optional)"
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Save
            </PrimaryButton>
          </DialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
