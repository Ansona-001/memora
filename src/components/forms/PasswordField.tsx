import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { IconActionButton } from "@/components/buttons/IconActionButton";

import { FormTextField } from "./FormTextField";

interface PasswordFieldProps<TFormValues extends FieldValues> {
  name: Parameters<typeof FormTextField<TFormValues>>[0]["name"];
  label: string;
  autoComplete?: string;
}

export function PasswordField<TFormValues extends FieldValues>({
  name,
  label,
  autoComplete = "current-password",
}: PasswordFieldProps<TFormValues>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormTextField<TFormValues>
      name={name}
      label={label}
      type={isVisible ? "text" : "password"}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconActionButton
                label={isVisible ? "Hide password" : "Show password"}
                onClick={() => setIsVisible((visible) => !visible)}
                edge="end"
              >
                {isVisible ? (
                  <VisibilityOffRoundedIcon fontSize="small" />
                ) : (
                  <VisibilityRoundedIcon fontSize="small" />
                )}
              </IconActionButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
