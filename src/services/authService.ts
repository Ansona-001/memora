import { supabase } from "@/lib/supabase";
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "@/types/auth";

export async function signIn({ email, password }: LoginFormValues) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
}

export async function signUp({
  email,
  password,
  displayName,
}: RegisterFormValues) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function signOutAllDevices() {
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    throw error;
  }
}

export async function requestPasswordReset({
  email,
}: ForgotPasswordFormValues) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword({ password }: ResetPasswordFormValues) {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw error;
  }
}

export async function deleteOwnAccount() {
  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    throw error;
  }

  await supabase.auth.signOut();
}
