import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { PasswordField } from "@/components/forms/PasswordField";
import { ROUTES } from "@/constants/routes";
import type { ResetPasswordFormValues } from "@/types/auth";
import { getErrorMessage } from "@/utils/errorUtils";

import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema } from "../schemas/authSchemas";

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const resetPassword = useResetPassword();

  const onSubmit = methods.handleSubmit((values) => {
    resetPassword.mutate(values, {
      onSuccess: () => {
        if (onSuccess) {
          methods.reset();
          onSuccess();
        } else {
          navigate(ROUTES.home, { replace: true });
        }
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {resetPassword.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(resetPassword.error)}
          </AppAlert>
        ) : null}

        <PasswordField<ResetPasswordFormValues>
          name="password"
          label="New password"
          autoComplete="new-password"
        />
        <PasswordField<ResetPasswordFormValues>
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
        />

        <PrimaryButton
          type="submit"
          fullWidth
          isLoading={resetPassword.isPending}
        >
          Update password
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
