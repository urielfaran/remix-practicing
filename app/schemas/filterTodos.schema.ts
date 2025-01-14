import { z } from "zod";

export const filterTodosSchema = z.object({
  dueTime: z
    .array(z.string())
    .refine((value) => value.some((item) => item))
    .optional(),
  members: z
    .array(z.string())
    .refine((value) => value.some((item) => item))
    .optional(),
  status: z
    .array(z.string())
    .refine((value) => value.some((item) => item))
    .optional(),
});
