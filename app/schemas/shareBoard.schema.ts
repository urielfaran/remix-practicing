import { z } from "zod";

export const shareBoardSchema = z.object({
  boardId: z.number(),
  userId: z.number(),
  type: z.enum(["delete", "edit", "view"], {
    required_error: "You need to select a permission type.",
  }),
});
