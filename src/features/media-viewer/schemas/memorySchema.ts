import { z } from "zod";

export const memorySchema = z.object({
  title: z.string().max(120).optional(),
  aiCaption: z.string().max(220).optional(),
  aiTags: z.array(z.string()).optional(),
});

export type MemoryFormValues = z.infer<typeof memorySchema>;
