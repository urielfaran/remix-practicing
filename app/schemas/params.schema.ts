import { z } from "zod";
import { USER_STATUS } from "~/routes/api/get-users";


export const userParamsSchema = z.object({
  page: z.number(),
  userStatus: z.nativeEnum(USER_STATUS),
  todoId: z.number().optional(),
  search: z.string().optional()
});
