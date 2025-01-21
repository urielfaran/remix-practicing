import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  shareBoardResolver,
  shareBoardType,
} from "~/components/dialogs/ShareBoardDialog";
import { getBoard, updateUserPermission } from "~/utils/board.server";
import { createNotification } from "~/utils/notofications.server";
import { getUserDateForNotification } from "~/utils/utils";
import type { Route } from "./+types/delete-board-permission";

export async function action({ request }: Route.ActionArgs) {
  const { username, sendindUserId } = await getUserDateForNotification(request);

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<shareBoardType>(request, shareBoardResolver);

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  const board = await getBoard(Number(payload.boardId));

  try {
    await updateUserPermission({
      ...payload,
      permission: Number(payload.permission),
    });
    await createNotification(
      Number(sendindUserId),
      Number(payload.userId),
      `${username} has changed your permissions in board ${board?.name}`
    );
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "User Permissions Updation Has Been Failed",
        toastContent: "Could not update permissions!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "User Permissions Have Been Updated",
    toastContent: "User permissions updated successfully!",
  });
}
