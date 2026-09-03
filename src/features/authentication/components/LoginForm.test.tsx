import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen, waitFor } from "@/test/testUtils";

import { LoginForm } from "./LoginForm";

const signInMock = vi.hoisted(() => vi.fn());

vi.mock("@/services/authService", () => ({
  signIn: signInMock,
}));

describe("LoginForm", () => {
  it("shows a validation error when submitted empty", async () => {
    renderWithProviders(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("submits valid credentials", async () => {
    signInMock.mockResolvedValueOnce(undefined);
    renderWithProviders(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Email"), "jamie@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "supersecure");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledTimes(1);
    });
    expect(signInMock.mock.calls[0]?.[0]).toEqual({
      email: "jamie@example.com",
      password: "supersecure",
    });
  });

  it("toggles password visibility", async () => {
    renderWithProviders(<LoginForm />);

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(
      screen.getByRole("button", { name: "Show password" }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
