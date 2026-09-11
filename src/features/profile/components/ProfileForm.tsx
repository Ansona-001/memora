import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { FormProvider, useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { FormTextField } from "@/components/forms/FormTextField";
import { getErrorMessage } from "@/utils/errorUtils";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profileSchema";

interface ProfileFormProps {
  displayName: string;
}

export function ProfileForm({ displayName }: ProfileFormProps) {
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName },
  });
  const updateProfile = useUpdateProfile();

  const onSubmit = methods.handleSubmit((values) => {
    updateProfile.mutate(
      { display_name: values.displayName },
      { onSuccess: () => methods.reset(values) },
    );
  });

  return (
    <FormProvider {...methods}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
        {updateProfile.isError ? (
          <AppAlert severity="error">
            {getErrorMessage(updateProfile.error)}
          </AppAlert>
        ) : null}
        {updateProfile.isSuccess ? (
          <AppAlert severity="success">Profile updated.</AppAlert>
        ) : null}

        <FormTextField<ProfileFormValues>
          name="displayName"
          label="Display name"
          autoComplete="name"
        />

        <PrimaryButton
          type="submit"
          isLoading={updateProfile.isPending}
          disabled={!methods.formState.isDirty}
        >
          Save changes
        </PrimaryButton>
      </Stack>
    </FormProvider>
  );
}
