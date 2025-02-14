import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  baseLabelReslover,
  baseLabelSchemaType,
} from "~/components/forms/AddLabelForm";
import { assignTodo } from "~/utils/todo.server";
import { Route } from "./+types/add-label";
import { createLabel } from "~/utils/label.server";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<baseLabelSchemaType>(
    request,
    baseLabelReslover
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await createLabel({ ...payload });
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Label Creation Has Been Failed",
        toastContent: "Could not create label!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Label Has Been Created",
    toastContent: "Label has been added successfully!",
  });
}
