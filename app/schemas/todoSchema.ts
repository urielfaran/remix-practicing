import { z } from "zod";

export const todoIdSchema = z.object({
  id: z.coerce.number(),
});

export const todoDueTimeSchema = z.object({
  dueTime: z.preprocess(
    (v) => (v === "undefined" ? new Date() : v),
    z.coerce.date()
  ),
  id: z.coerce.number(),
});

export const todoContentSchema = z.object({
  title: z.string({
    required_error: "enter title",
  }),
  description: z.string().nullable().optional(),
  id: z.coerce.number(),
});

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
