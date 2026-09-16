import { z } from "zod";

export const createCoupleSpaceSchema = z.object({
  name: z.string().min(1, "Give your space a name").max(60),
});

export const updateCoupleSpaceSchema = createCoupleSpaceSchema.extend({
  publicSlug: z
    .string()
    .min(3, "At least 3 characters")
    .max(60)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Lowercase letters, numbers, and hyphens only",
    ),
});

export const joinCoupleSpaceSchema = z.object({
  code: z
    .string()
    .min(1, "Enter your invitation code")
    .transform((value) => value.trim().toUpperCase()),
});
