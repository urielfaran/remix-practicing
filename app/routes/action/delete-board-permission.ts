import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  shareBoardResolver,
  shareBoardType,
} from "~/components/dialogs/ShareBoardDialog";
import type { Route } from "./+types/delete-board-permission";
import { deleteUserPermission } from "~/utils/board.server";

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
    await deleteUserPermission(payload.userId, payload.boardId);
  } catch (errors) {
    return data(
      {
        errors,
        payload,
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
