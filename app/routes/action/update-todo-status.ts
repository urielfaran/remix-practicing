import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import {
  updateListResolver,
  updateListSchemaType,
} from "~/components/forms/ListForm";
import { updateList } from "~/utils/list.server";
import { Route } from "./+types/update-todo-status";
import { z } from "zod";
import { updateTodoStatusSchema } from "~/schemas/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTodoStatus } from "~/utils/todo.server";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<z.infer<typeof updateTodoStatusSchema>>(
    request,
    zodResolver(updateTodoStatusSchema)
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }
  try {
    await updateTodoStatus({
     ...payload
    });
  } catch (err) {
    return data(
      {
        err,
        payload,
        toastTitle: "Todo Updation Has Been Failed",
        toastContent: "Could not update todo!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Todo Has Been Updated",
    toastContent: "Todo has been updated successfully!",
  });
}
