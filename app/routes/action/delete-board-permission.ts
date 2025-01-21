import { data } from "react-router";
import invariant from "tiny-invariant";
import { deleteUserPermission, getBoard } from "~/utils/board.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-board-permission";
import { createNotification } from "~/utils/notofications.server";
import { authenticator } from "~/auth/authenticator";
import { getUserById } from "~/utils/user.server";

export async function action({ request }: Route.ActionArgs) {
  const sendindUserId = await authenticator.requireUser(request, "/login");
  invariant(sendindUserId, "user is not logged in");

  const user = await getUserById(Number(sendindUserId));

  const userId = await getRequestField("userId", request, {
    stringified: false,
  });
  invariant(userId);
  const boardId = await getRequestField("boardId", request, {
    stringified: false,
  });
  invariant(boardId);

  const board = await getBoard(Number(boardId));

  try {
    await deleteUserPermission(Number(userId), Number(boardId));
    await createNotification(
      Number(sendindUserId),
      Number(userId),
      `${user?.username} has removed you from board ${board?.name}`
    );
  } catch (errors) {
    return data(
      {
        errors,
        toastTitle: "User Permissions Deletion Has Been Failed",
        toastContent: "Could not delete permissions!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "User Permissions Have Been Deleted",
    toastContent: "User permissions deleted successfully!",
  });
}
