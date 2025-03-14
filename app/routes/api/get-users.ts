import { userParamsSchema } from "~/schemas/params.schema";
import { Route } from "./+types/get-users";
import { data } from "react-router";
import { getUsers } from "~/utils/user.server";
import { authenticator } from "~/auth/authenticator";
import invariant from "tiny-invariant";

export enum USER_STATUS {
  NOT_ASSIGNED_TO_BOARD = "NOT_ASSIGNED_TO_BOARD",
  ASSIGNED_TO_BOARD_WITH_CURRENT = "ASSIGNED_TO_BOARD_WITH_CURRENT",
  ASSIGNED_TO_BOARD_WITHOUT_CURRENT = "ASSIGNED_TO_BOARD_WITHOUT_CURRENT",
  ASSIGNED_TO_TODO = "ASSIGNED_TO_TODO",
  NOT_ASSIGNED_TO_TODO = "NOT_ASSIGNED_TO_TODO",
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const url = new URL(request.url);
  const result = userParamsSchema.safeParse(url.searchParams);

  const boardId = params.boardId; // This will be "3"

  if (!result.success) {
    return data(result.error);
  }

  const { page, userStatus, todoId, search } = result.data;

  const users = await getUsers({
    boardId: Number(boardId),
    userId: Number(userId),
    userStatus,
    page,
    todoId,
    search
  });

  return { users, page };
}
