import { z } from "zod";

export const filterBoardsSchema = z.object({
  query: z.string().nullable().optional(),
});
