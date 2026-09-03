import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import { ROUTES } from "@/constants/routes";
import type { CreateCoupleSpaceFormValues } from "@/types/coupleSpace";
import { getErrorMessage } from "@/utils/errorUtils";

import { useCreateCoupleSpace } from "../hooks/useCreateCoupleSpace";
import { createCoupleSpaceSchema } from "../schemas/coupleSpaceSchemas";

export function CreateCoupleSpaceForm() {
  const navigate = useNavigate();
  const methods = useForm<CreateCoupleSpaceFormValues>({
    resolver: zodResolver(createCoupleSpaceSchema),
    defaultValues: { name: "Our Space" },
  });
  const createSpace = useCreateCoupleSpace();

  const onSubmit = methods.handleSubmit(({ name }) => {
    createSpace.mutate(name, {
      onSuccess: () => navigate(ROUTES.coupleInvite, { replace: true }),
    });
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {createSpace.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(createSpace.error)}
          </AppAlert>
        ) : null}

        <FormTextField<CreateCoupleSpaceFormValues>
          name="name"
          label="Space name"
          autoComplete="off"
        />

        <PrimaryButton
          type="submit"
          fullWidth
          isLoading={createSpace.isPending}
        >
          Create space
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
