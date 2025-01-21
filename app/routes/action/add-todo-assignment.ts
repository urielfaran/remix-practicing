import { z } from "zod";
import type { Route } from "./+types/add-todo-assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignTodoSchema } from "~/schemas/todo.schema";
import { getValidatedFormData } from "remix-hook-form";
import { data } from "react-router";
import { assignTodo, getTodoTitleById } from "~/utils/todo.server";
import { authenticator } from "~/auth/authenticator";
import invariant from "tiny-invariant";
import { getUserById } from "~/utils/user.server";
import { createNotification } from "~/utils/notofications.server";

type assignTodoSchemaType = z.infer<typeof assignTodoSchema>;
const assignTodoSchemaResolver = zodResolver(assignTodoSchema);
export async function action({ request }: Route.ActionArgs) {
  const sendindUserId = await authenticator.requireUser(request, "/login");
  invariant(sendindUserId, "user is not logged in");

  const user = await getUserById(Number(sendindUserId));

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
  const todo = await getTodoTitleById(payload.todoId);
  const message =
    Number(sendindUserId) === payload.userId
      ? `you have assigned yourself to todo ${todo?.title}`
      : `${user?.username} has assigned you to todo ${todo?.title}`;
  try {
    await assignTodo({ ...payload });
    await createNotification(
      Number(sendindUserId),
      (payload.userId),
      message
    );
  } catch (errors) {
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
