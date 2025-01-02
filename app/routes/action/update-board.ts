import { getValidatedFormData } from "remix-hook-form";
import type { Route } from "./+types/update-board";
import {
  updateBoardResolver,
  updateBoardSchemaType,
} from "~/components/forms/BoardForm";
import { data } from "react-router";
import { updateBoard } from "~/utils/board";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<updateBoardSchemaType>(
    request,
    updateBoardResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await updateBoard(payload);
  } catch (err) {
    return data(
      {
        err,
        toastTitle: "Board Updation Has Been Failed",
        toastContent: "Could not update board!",
      },
      { status: 400 }
    );
  }
  return data({
    ok: true,
    toastTitle: "Board Has Been Updated",
    toastContent: "Board has been updated successfully!",
  });
}
