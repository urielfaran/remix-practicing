import { zodResolver } from "@hookform/resolvers/zod";
import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { assignTodoSchema } from "~/schemas/todo.schema";
import { unassignTodo } from "~/utils/todo.server";
import type { Route } from "./+types/add-todo-assignment";

type assignTodoSchemaType = z.infer<typeof assignTodoSchema>;
const assignTodoSchemaResolver = zodResolver(assignTodoSchema);
export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<assignTodoSchemaType>(
    request,
    assignTodoSchemaResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await unassignTodo({ ...payload });
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Todo Unassigning Has Been Failed",
        toastContent: "Could not unassign todo!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Todo Has Been Unassigned",
    toastContent: "Todo has been unassigned successfully!",
  });
}
