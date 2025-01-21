import { data } from "react-router";
import invariant from "tiny-invariant";
import { deleteUserPermission, getBoard } from "~/utils/board.server";
import { getRequestField, getUserDateForNotification } from "~/utils/utils";
import type { Route } from "./+types/delete-board-permission";
import { createNotification } from "~/utils/notofications.server";
import { authenticator } from "~/auth/authenticator";
import { getUserById } from "~/utils/user.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { userBoardSchema } from "~/schemas/shareBoard.schema";
import { z } from "zod";
import { getValidatedFormData } from "remix-hook-form";

const userBoardResolver = zodResolver(userBoardSchema);
type userBoardType = z.infer<typeof userBoardSchema>;

export async function action({ request }: Route.ActionArgs) {
  const {username, sendindUserId} = await getUserDateForNotification(request)

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<userBoardType>(request, userBoardResolver);

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  const board = await getBoard(payload.boardId);

  try {
    await deleteUserPermission({ ...payload });
    await createNotification(
      Number(sendindUserId),
      payload.userId,
      `${username} has removed you from board ${board?.name}`
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
