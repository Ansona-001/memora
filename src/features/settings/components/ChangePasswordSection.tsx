import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { AppAlert } from "@/components/feedback/AppAlert";
import { ResetPasswordForm } from "@/features/authentication/components/ResetPasswordForm";

export function ChangePasswordSection() {
  const [justUpdated, setJustUpdated] = useState(false);

  return (
    <Accordion disableGutters elevation={0} sx={{ "&:before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Typography>Change password</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {justUpdated ? (
          <AppAlert severity="success" sx={{ mb: 2 }}>
            Password updated.
          </AppAlert>
        ) : null}
        <ResetPasswordForm onSuccess={() => setJustUpdated(true)} />
      </AccordionDetails>
    </Accordion>
  );
}
