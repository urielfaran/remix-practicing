import { data } from "react-router";
import invariant from "tiny-invariant";
import { deleteTodo } from "~/utils/todo.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-todo";
export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);

  try {
    await deleteTodo(Number(id));
  } catch (errors) {
    return data(
      {
        errors,
        id,
        toastTitle: "Todo Deletion Has Been Failed",
        toastContent: "Could not delete todo!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Todo Has Been Deleted",
    toastContent: "Todo has been deleted successfully!",
  });
}
