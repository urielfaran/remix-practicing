import { z } from "zod";

export const createListSchema = z.object({
  title: z.string({
    required_error: "enter title",
  }),
  boardId: z.coerce.number(),
});

export const updateListSchema = createListSchema
  .pick({
    title: true,
  })
  .extend({
    id: z.number(),
  });
