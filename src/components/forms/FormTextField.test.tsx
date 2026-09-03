import userEvent from "@testing-library/user-event";
import { useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { FormTextField } from "./FormTextField";

interface TestFormValues {
  email: string;
}

function TestForm({
  children,
  defaultErrors,
}: {
  children: ReactNode;
  defaultErrors?: boolean;
}) {
  const methods = useForm<TestFormValues>({ defaultValues: { email: "" } });
  const { setError } = methods;

  useEffect(() => {
    if (defaultErrors) {
      setError("email", { message: "Email is required" });
    }
  }, [defaultErrors, setError]);

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("FormTextField", () => {
  it("registers the field and accepts input", async () => {
    renderWithProviders(
      <TestForm>
        <FormTextField<TestFormValues> name="email" label="Email" />
      </TestForm>,
    );

    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "hello@example.com");

    expect(input).toHaveValue("hello@example.com");
  });

  it("displays a validation error message", () => {
    renderWithProviders(
      <TestForm defaultErrors>
        <FormTextField<TestFormValues> name="email" label="Email" />
      </TestForm>,
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });
});
