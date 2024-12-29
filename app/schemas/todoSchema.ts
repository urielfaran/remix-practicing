import { z } from "zod";

// export const updateTodoSchema = createTodoSchema.merge(
//   z.object({
//     id: z.coerce.number(),
//   })
// );

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

export const createTodoSchema = todoContentSchema
  .merge(todoDueTimeSchema)
  .merge(
    z.object({
      listId: z.coerce.number(),
    })
  );
