import { z } from "zod";

export const createCoupleSpaceSchema = z.object({
  name: z.string().min(1, "Give your space a name").max(60),
});

export const joinCoupleSpaceSchema = z.object({
  code: z
    .string()
    .min(1, "Enter your invitation code")
    .transform((value) => value.trim().toUpperCase()),
});
