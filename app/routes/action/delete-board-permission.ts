import { data } from "react-router";
import invariant from "tiny-invariant";
import { deleteUserPermission } from "~/utils/board.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-board-permission";

export async function action({ request }: Route.ActionArgs) {
  const userId = await getRequestField("userId", request, {
    stringified: false,
  });
  invariant(userId);
  const boardId = await getRequestField("boardId", request, {
    stringified: false,
  });
  invariant(boardId);

  try {
    await deleteUserPermission(Number(userId), Number(boardId));
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
