import { z } from "zod";

export const USER_STATUS = {
  NOT_ASSIGNED_TO_BOARD: "NOT_ASSIGNED_TO_BOARD",
  ASSIGNED_TO_BOARD_WITH_CURRENT: "ASSIGNED_TO_BOARD_WITH_CURRENT",
  ASSIGNED_TO_BOARD_WITHOUT_CURRENT: "ASSIGNED_TO_BOARD_WITHOUT_CURRENT",
  ASSIGNED_TO_TODO: "ASSIGNED_TO_TODO",
  NOT_ASSIGNED_TO_TODO: "NOT_ASSIGNED_TO_TODO",
} as const;

export const userParamsSchema = z.object({
  page: z.coerce.number(),
  userStatus: z.nativeEnum(USER_STATUS),
  search: z.string().optional(),
  todoId: z.number().optional(),
});
