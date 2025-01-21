import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  shareBoardResolver,
  shareBoardType,
} from "~/components/dialogs/ShareBoardDialog";
import { addUserPermission, getBoard } from "~/utils/board.server";
import { createNotification } from "~/utils/notofications.server";
import { getUserDateForNotification } from "~/utils/utils";
import type { Route } from "./+types/share-board";

export async function action({ request }: Route.ActionArgs) {
  const { username, sendindUserId } = await getUserDateForNotification(request);

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<shareBoardType>(request, shareBoardResolver);

  if (errors || !payload.permission) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  const board = await getBoard(payload.boardId);

  try {
    await addUserPermission(
      payload.userId,
      payload.boardId,
      Number(payload.permission)
    );
    await createNotification(
      Number(sendindUserId),
      payload.userId,
      `${username} has shared with you board ${board?.name}`
    );
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Board Sharing Has Been Failed",
        toastContent: "Could not share board!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Board Has Been Shared",
    toastContent: "Board has been shared successfully!",
  });
}
