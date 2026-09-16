import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import type { UpdateCoupleSpaceFormValues } from "@/types/coupleSpace";
import { getErrorMessage } from "@/utils/errorUtils";

import { useUpdateCoupleSpace } from "../hooks/useUpdateCoupleSpace";
import { updateCoupleSpaceSchema } from "../schemas/coupleSpaceSchemas";

function getPublicSlugErrorMessage(error: unknown): string | null {
  const code = (error as { code?: string } | null)?.code;
  if (code === "23505") {
    return "That handle is already taken — try another.";
  }
  if (code === "23514") {
    return "That handle isn't available — try a different one.";
  }
  return null;
}

interface CoupleSpaceFormProps {
  coupleSpaceId: string;
  name: string;
  publicSlug: string;
}

export function CoupleSpaceForm({
  coupleSpaceId,
  name,
  publicSlug,
}: CoupleSpaceFormProps) {
  const methods = useForm<UpdateCoupleSpaceFormValues>({
    resolver: zodResolver(updateCoupleSpaceSchema),
    defaultValues: { name, publicSlug },
  });
  const updateSpace = useUpdateCoupleSpace(coupleSpaceId);

  const onSubmit = methods.handleSubmit((values) => {
    updateSpace.mutate(
      { name: values.name, public_slug: values.publicSlug },
      { onSuccess: () => methods.reset(values) },
    );
  });

  const slugErrorMessage = updateSpace.isError
    ? getPublicSlugErrorMessage(updateSpace.error) ??
      getErrorMessage(updateSpace.error)
    : null;

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {updateSpace.isError ? (
          <AppAlert severity="error">{slugErrorMessage}</AppAlert>
        ) : null}

        <FormTextField<UpdateCoupleSpaceFormValues>
          name="name"
          label="Space name"
          autoComplete="off"
        />

        <FormTextField<UpdateCoupleSpaceFormValues>
          name="publicSlug"
          label="Public handle"
          autoComplete="off"
        />
        <Typography variant="caption" color="textSecondary" sx={{ mt: -1.5 }}>
          Anyone with this link can view whichever albums you've turned
          sharing on: {window.location.origin}/{methods.watch("publicSlug")}
        </Typography>

        <PrimaryButton
          type="submit"
          isLoading={updateSpace.isPending}
          disabled={!methods.formState.isDirty}
        >
          Save changes
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
