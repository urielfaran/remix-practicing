import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  updateListResolver,
  updateListSchemaType,
} from "~/components/forms/ListForm";
import { updateList } from "~/utils/list.server";
import type { Route } from "./+types/update-list";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<updateListSchemaType>(
    request,
    updateListResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }
  try {
    await updateList({
      title: payload.title,
      id: payload.id,
    });
  } catch (err) {
    return data(
      {
        err,
        payload,
        toastTitle: "List Updation Has Been Failed",
        toastContent: "Could not update List!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "List Has Been Updated",
    toastContent: "List has been updated successfully!",
  });
}
