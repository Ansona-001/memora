import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

interface FormTextFieldProps<TFormValues extends FieldValues> extends Omit<
  TextFieldProps,
  "name" | "error" | "helperText"
> {
  name: Path<TFormValues>;
}

export function FormTextField<TFormValues extends FieldValues>({
  name,
  ...textFieldProps
}: FormTextFieldProps<TFormValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = errors[name];
  const errorMessage =
    typeof fieldError?.message === "string" ? fieldError.message : undefined;

  return (
    <TextField
      fullWidth
      error={Boolean(fieldError)}
      helperText={errorMessage}
      {...register(name)}
      {...textFieldProps}
    />
  );
}
