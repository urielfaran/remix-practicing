import { z } from "zod";

export const baseLabelSchema = z.object({
  todoId: z.number(),
  backgroundColor: z.string().optional(),
  text: z.string().optional(),
});

export const updateLabelSchema = baseLabelSchema.merge(
  z.object({
    labelId: z.number(),
  })
);
