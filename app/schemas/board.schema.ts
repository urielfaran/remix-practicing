import { z } from "zod";

export const updateBoardSchema = z.object({
  name: z.string().optional(),
  backgroundColor: z.string().optional().nullable(),
  id: z.number(),
  userId: z.number()
});

export const createBoardSchema = updateBoardSchema
  .omit({
    id: true,
  })
  .extend({
    name: z.string({ required_error: "enter title" }),
  });

export const favoriteBoardSchema = z.object({
  id: z.number(),
  isFavorite: z.boolean(),
});
