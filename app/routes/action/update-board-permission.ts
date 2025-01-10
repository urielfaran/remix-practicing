import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  shareBoardResolver,
  shareBoardType,
} from "~/components/dialogs/ShareBoardDialog";
import type { Route } from "./+types/delete-board-permission";
import {
  deleteUserPermission,
  updateUserPermission,
} from "~/utils/board.server";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<shareBoardType>(request, shareBoardResolver);

  if (errors || !payload.permission) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await updateUserPermission({
      ...payload,
      permission: Number(payload.permission),
    });
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
