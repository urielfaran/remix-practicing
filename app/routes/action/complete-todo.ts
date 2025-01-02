import { data } from "react-router";
import invariant from "tiny-invariant";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/complete-todo";
import { completeTodo } from "~/utils/todo.server";
export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);

  const isCompletedString = await getRequestField("is-completed", request, {
    stringified: false,
  });
  invariant(isCompletedString);
  const isCompleted = isCompletedString === "false" ? false : true;

  try {
    await completeTodo(Number(id), isCompleted);
  } catch (errors) {
    return data(
      {
        errors,
        id,
        toastTitle: `Todo ${
          isCompleted ? "Uncompletion" : "Completion "
        } Has Been Failed`,
        toastContent: `Could not ${isCompleted && "un"}complete todo!`,
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: `Todo Has Been ${isCompleted ? "Uncompleted" : "Completed "}`,
    toastContent: `Todo has been ${isCompleted && "un"}completed successfully!`,
  });
}
