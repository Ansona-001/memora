import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import type { ForgotPasswordFormValues } from "@/types/auth";
import { getErrorMessage } from "@/utils/errorUtils";

import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema } from "../schemas/authSchemas";

export function ForgotPasswordForm() {
  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const forgotPassword = useForgotPassword();

  const onSubmit = methods.handleSubmit((values) => {
    forgotPassword.mutate(values);
  });

  if (forgotPassword.isSuccess) {
    return (
      <AppAlert severity="success">
        If an account exists for that email, a reset link is on its way.
      </AppAlert>
    );
  }

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {forgotPassword.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(forgotPassword.error)}
          </AppAlert>
        ) : null}

        <FormTextField<ForgotPasswordFormValues>
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />

        <PrimaryButton
          type="submit"
          fullWidth
          isLoading={forgotPassword.isPending}
        >
          Send reset link
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
