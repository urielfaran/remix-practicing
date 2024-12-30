import { z } from "zod";

export const createListSchema = z.object({
  title: z.string({
    required_error: "enter title",
  }),
  boardId: z.coerce.number(),
});

export const updateListSchema = z.object({
  title: z.string({
    required_error: "enter title",
  }),
  id: z.number(),
});
