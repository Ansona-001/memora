import { useState } from "react";

import { AppAlert } from "@/components/feedback/AppAlert";
import { ResetPasswordForm } from "@/features/authentication/components/ResetPasswordForm";

export function ChangePasswordSection() {
  const [justUpdated, setJustUpdated] = useState(false);

  return (
    <>
      {justUpdated ? (
        <AppAlert severity="success" sx={{ mb: 2 }}>
          Password updated.
        </AppAlert>
      ) : null}
      <ResetPasswordForm onSuccess={() => setJustUpdated(true)} />
    </>
  );
}
