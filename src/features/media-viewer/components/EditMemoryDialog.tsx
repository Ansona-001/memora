import { zodResolver } from "@hookform/resolvers/zod";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
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
    values: {
      title: memory.title ?? "",
      aiCaption: memory.ai_caption ?? "",
      aiTags: memory.ai_tags ?? [],
    },
  });

  const [newTag, setNewTag] = useState("");
  const tags = methods.watch("aiTags") ?? [];

  const removeTag = (tag: string) =>
    methods.setValue(
      "aiTags",
      tags.filter((t) => t !== tag),
      { shouldDirty: true },
    );

  const addTag = () => {
    const normalized = newTag.trim().toLowerCase().replace(/^#/, "");
    if (!normalized || tags.includes(normalized)) {
      setNewTag("");
      return;
    }
    methods.setValue("aiTags", [...tags, normalized], { shouldDirty: true });
    setNewTag("");
  };

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
            <Stack spacing={2}>
              <FormTextField<MemoryFormValues>
                name="title"
                label="Title (optional)"
                autoComplete="off"
              />
              <Box>
                <FormTextField<MemoryFormValues>
                  name="aiCaption"
                  label="AI caption (optional)"
                  autoComplete="off"
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  Generated automatically — edit or clear it if it&apos;s
                  wrong.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  Tags
                </Typography>
                {tags.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        variant="outlined"
                        onDelete={() => removeTag(tag)}
                      />
                    ))}
                  </Box>
                ) : null}
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Add tag"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
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
