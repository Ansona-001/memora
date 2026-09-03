import { z } from "zod";

const environmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const parsedEnvironment = environmentSchema.safeParse(import.meta.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid application environment configuration: ${parsedEnvironment.error.message}`,
  );
}

export const env = {
  supabaseUrl: parsedEnvironment.data.VITE_SUPABASE_URL,
  supabaseAnonKey: parsedEnvironment.data.VITE_SUPABASE_ANON_KEY,
};
