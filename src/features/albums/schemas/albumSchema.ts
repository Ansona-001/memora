import { z } from "zod";

export const albumSchema = z.object({
  title: z.string().min(1, "Give the album a title").max(80),
  description: z.string().max(280).optional(),
});

export type AlbumFormValues = z.infer<typeof albumSchema>;
