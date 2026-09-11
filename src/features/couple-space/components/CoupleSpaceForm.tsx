import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import type { UpdateCoupleSpaceFormValues } from "@/types/coupleSpace";
import { getErrorMessage } from "@/utils/errorUtils";

import { CoupleCoverUpload } from "./CoupleCoverUpload";
import { useUpdateCoupleSpace } from "../hooks/useUpdateCoupleSpace";
import { updateCoupleSpaceSchema } from "../schemas/coupleSpaceSchemas";

interface CoupleSpaceFormProps {
  coupleSpaceId: string;
  name: string;
  coverPath: string | null;
}

export function CoupleSpaceForm({
  coupleSpaceId,
  name,
  coverPath,
}: CoupleSpaceFormProps) {
  const methods = useForm<UpdateCoupleSpaceFormValues>({
    resolver: zodResolver(updateCoupleSpaceSchema),
    defaultValues: { name },
  });
  const updateSpace = useUpdateCoupleSpace(coupleSpaceId);

  const onSubmit = methods.handleSubmit((values) => {
    updateSpace.mutate(
      { name: values.name },
      { onSuccess: () => methods.reset(values) },
    );
  });

  return (
    <Stack spacing={2}>
      <CoupleCoverUpload coupleSpaceId={coupleSpaceId} coverPath={coverPath} />

      <FormProvider {...methods}>
        <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
          {updateSpace.isError ? (
            <AppAlert severity="error">
              {getErrorMessage(updateSpace.error)}
            </AppAlert>
          ) : null}

          <FormTextField<UpdateCoupleSpaceFormValues>
            name="name"
            label="Space name"
            autoComplete="off"
          />

          <PrimaryButton
            type="submit"
            isLoading={updateSpace.isPending}
            disabled={!methods.formState.isDirty}
          >
            Save changes
          </PrimaryButton>
        </Stack>
      </FormProvider>
    </Stack>
  );
}
