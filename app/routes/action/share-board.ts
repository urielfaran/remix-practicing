import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  shareBoardResolver,
  shareBoardType,
} from "~/components/dialogs/ShareBoardDialog";
import type { Route } from "./+types/share-board";
import { shareBoard } from "~/utils/board.server";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<shareBoardType>(request, shareBoardResolver);

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });

  }
  try {
    await shareBoard(
      payload.userId,
      payload.boardId,
      Number(payload.permission)
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
