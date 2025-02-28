import { zodResolver } from "@hookform/resolvers/zod";
import { Route } from "./+types/change-todo-list";
import { z } from "zod";
import { changeTodoistSchema } from "~/schemas/todo.schema";
import { getValidatedFormData } from "remix-hook-form";
import { data } from "react-router";
import { changeTodoList } from "~/utils/todo.server";

const changeTodoListResolver = zodResolver(changeTodoistSchema);
type changeTodoListType = z.infer<typeof changeTodoistSchema>;

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<changeTodoListType>(
    request,
    changeTodoListResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await changeTodoList({ ...payload });
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Todo Mutation Has Benn Failed",
        toastContent: "Could not mutate todo!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Todo Has Been Mutated",
    toastContent: "Todo has been mutated successfully!",
  });
}
