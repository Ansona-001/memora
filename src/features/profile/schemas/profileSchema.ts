import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(60),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
