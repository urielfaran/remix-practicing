import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string({
    required_error: "enter title",
  }),
  backgroundColor: z.string().optional().nullable(),
});

export const updateBoardSchema = createBoardSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const favoriteBoardSchema = z.object({
  id: z.number(),
  isFavorite: z.boolean()
});
