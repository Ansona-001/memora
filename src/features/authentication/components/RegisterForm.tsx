import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import { PasswordField } from "@/components/forms/PasswordField";
import { ROUTES } from "@/constants/routes";
import type { RegisterFormValues } from "@/types/auth";
import { getErrorMessage } from "@/utils/errorUtils";

import { useRegister } from "../hooks/useRegister";
import { registerSchema } from "../schemas/authSchemas";

export function RegisterForm() {
  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const register = useRegister();

  const onSubmit = methods.handleSubmit((values) => {
    register.mutate(values);
  });

  if (register.isSuccess) {
    return (
      <AppAlert severity="success">
        Check your email to confirm your account before logging in.
      </AppAlert>
    );
  }

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {register.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(register.error)}
          </AppAlert>
        ) : null}

        <FormTextField<RegisterFormValues>
          name="displayName"
          label="Name"
          autoComplete="name"
        />
        <FormTextField<RegisterFormValues>
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        <PasswordField<RegisterFormValues>
          name="password"
          label="Password"
          autoComplete="new-password"
        />
        <PasswordField<RegisterFormValues>
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
        />

        <PrimaryButton type="submit" fullWidth isLoading={register.isPending}>
          Create account
        </PrimaryButton>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Already have an account?{" "}
          <Typography
            component={RouterLink}
            to={ROUTES.login}
            variant="body2"
            color="primary.main"
            sx={{ display: "inline" }}
          >
            Log in
          </Typography>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
