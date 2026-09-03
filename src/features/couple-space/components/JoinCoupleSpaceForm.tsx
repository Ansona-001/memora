import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import { ROUTES } from "@/constants/routes";
import type { JoinCoupleSpaceFormValues } from "@/types/coupleSpace";
import { getErrorMessage } from "@/utils/errorUtils";

import { useJoinCoupleSpace } from "../hooks/useJoinCoupleSpace";
import { joinCoupleSpaceSchema } from "../schemas/coupleSpaceSchemas";

export function JoinCoupleSpaceForm() {
  const navigate = useNavigate();
  const methods = useForm<JoinCoupleSpaceFormValues>({
    resolver: zodResolver(joinCoupleSpaceSchema),
    defaultValues: { code: "" },
  });
  const joinSpace = useJoinCoupleSpace();

  const onSubmit = methods.handleSubmit(({ code }) => {
    joinSpace.mutate(code, {
      onSuccess: () => navigate(ROUTES.home, { replace: true }),
    });
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {joinSpace.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(joinSpace.error)}
          </AppAlert>
        ) : null}

        <FormTextField<JoinCoupleSpaceFormValues>
          name="code"
          label="Invitation code"
          autoComplete="off"
          slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
        />

        <PrimaryButton type="submit" fullWidth isLoading={joinSpace.isPending}>
          Join space
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
