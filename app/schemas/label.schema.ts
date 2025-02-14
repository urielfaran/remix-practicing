import { z } from "zod";

export const baseLabelSchema = z.object({
  todoId: z.number(),
  backgroundColor: z.string().optional(),
});
