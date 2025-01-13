import { z } from "zod";
import type { Route } from "./+types/add-todo-assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignTodoSchema } from "~/schemas/todo.schema";
import { getValidatedFormData } from "remix-hook-form";
import { data } from "react-router";
import { assignTodo } from "~/utils/todo.server";

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

  try{
    await assignTodo({...payload})
  }catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Todo Assigning Has Been Failed",
        toastContent: "Could not assign todo!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Todo Has Been Assigned",
    toastContent: "Todo has been assigned successfully!",
  });
}
