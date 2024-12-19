import { z } from "zod";

export const filterTodosSchema = z.object({
  query: z.string().nullable().optional(),
  startDate: z.preprocess(
    (v) =>
      v === "undefined"
        ? new Date(
            new Date().getFullYear() - 1,
            new Date().getMonth(),
            new Date().getDate()
          )
        : v,
    z.coerce.date().optional()
  ),
  endDate: z.preprocess(
    (v) => (v === "undefined" ? new Date() : v),
    z.coerce.date().optional()
  ),
});
