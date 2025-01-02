import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string({
    required_error: "enter title",
  }),
  description: z.string().nullable().optional(),
  dueTime: z.preprocess(
    (v) => (v === "undefined" ? new Date() : v),
    z.coerce.date()
  ),
  listId: z.coerce.number(),
});

export const todoDueTimeSchema = createTodoSchema
  .pick({
    dueTime: true,
  })
  .extend({
    id: z.coerce.number(),
  });

export const todoContentSchema = createTodoSchema
  .pick({
    title: true,
    description: true,
  })
  .extend({
    id: z.coerce.number(),
  });
