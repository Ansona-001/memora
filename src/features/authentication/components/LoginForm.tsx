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
import { getErrorMessage } from "@/utils/errorUtils";

import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../schemas/authSchemas";
import type { LoginFormValues } from "@/types/auth";

export function LoginForm() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const login = useLogin();

  const onSubmit = methods.handleSubmit((values) => {
    login.mutate(values);
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {login.isError ? (
          <AppAlert severity="error">{getErrorMessage(login.error)}</AppAlert>
        ) : null}

        <FormTextField<LoginFormValues>
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        <PasswordField<LoginFormValues>
          name="password"
          label="Password"
          autoComplete="current-password"
        />

        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <Typography
            component={RouterLink}
            to={ROUTES.forgotPassword}
            variant="body2"
            color="text.secondary"
          >
            Forgot password?
          </Typography>
        </Stack>

        <PrimaryButton type="submit" fullWidth isLoading={login.isPending}>
          Log in
        </PrimaryButton>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Don&apos;t have an account?{" "}
          <Typography
            component={RouterLink}
            to={ROUTES.register}
            variant="body2"
            color="primary.main"
            sx={{ display: "inline" }}
          >
            Register
          </Typography>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
