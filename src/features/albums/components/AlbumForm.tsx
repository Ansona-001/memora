import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";

import { albumSchema, type AlbumFormValues } from "../schemas/albumSchema";

interface AlbumFormProps {
  defaultValues?: AlbumFormValues;
  onSubmit: (values: AlbumFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
  errorMessage?: string | null;
}

export function AlbumForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  errorMessage,
}: AlbumFormProps) {
  const methods = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: defaultValues ?? { title: "", description: "" },
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        {errorMessage ? (
          <AppAlert severity="error">{errorMessage}</AppAlert>
        ) : null}

        <FormTextField<AlbumFormValues>
          name="title"
          label="Album title"
          autoComplete="off"
        />
        <FormTextField<AlbumFormValues>
          name="description"
          label="Description (optional)"
          multiline
          minRows={3}
        />

        <PrimaryButton type="submit" isLoading={isSubmitting} fullWidth>
          {submitLabel}
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
