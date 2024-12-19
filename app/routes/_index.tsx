import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import AddListButton from "~/components/AddListButton";
import CreateTodo from "~/components/CreateTodo";
import DisplayList from "~/components/DisplayList";
import TodoCard from "~/components/DisplayTodo";
import FilterTodos from "~/components/FilterTodos";
import { ModeToggle } from "~/components/mode-toggle";
import ProgressBar from "~/components/ProgressBar";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { createListSchema, updateListSchema } from "~/schemas/listSchema";
import { createTodoSchema, updateTodoSchema } from "~/schemas/todoSchema";
import { createList, getAllLists } from "~/utils/list.server";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  getAllToDos,
  updateTodo,
} from "~/utils/todo.server";
import { getRequestField } from "~/utils/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const query = url.searchParams.get("query") || "";
  const startDateStr = url.searchParams.get("startDate");
  const endDateStr = url.searchParams.get("endDate");

  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const endDate = endDateStr ? new Date(endDateStr) : undefined;

  const todos = await getAllToDos({ query, startDate, endDate });
  const lists = await getAllLists();

  return { todos, lists };
}

export default function Index() {
  const { todos, lists } = useLoaderData<typeof loader>();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const onTimePrecent =
    (todos.filter((todo) => todo.dueTime >= startOfToday).length * 100) /
    todos.length;

  return (
    <div className="flex flex-col h-screen items-center space-y-5">
      <header className="border-b-2 dark:border-zinc-300 w-full flex flex-row justify-between p-4 m-1">
        <ModeToggle />
      </header>
      {/* <Card>
        <CreateTodo />
      </Card> */}
      {/* <Separator /> */}
      {/* <FilterTodos /> */}
      {/* <ProgressBar onTimePrecent={onTimePrecent} /> */}
      <Card className="w-5/6 h-5/6 ">
        <div className="flex flex-row gap-2">
          <AddListButton />
          <CardContent className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-7 w-full p-4">
          {lists.map((list) => (
            <DisplayList key={list.id} list={list} />
            ))}
            </CardContent>
        </div>
      </Card>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const _action = await getRequestField("_action", request);

  type createTodoSchemaType = z.infer<typeof createTodoSchema>;
  const createTodoResolver = zodResolver(createTodoSchema);
  type updateTodoSchemaType = z.infer<typeof updateTodoSchema>;
  const updateTodoResolver = zodResolver(updateTodoSchema);

  type createListSchemaType = z.infer<typeof createListSchema>;
  const createListResolver = zodResolver(createListSchema);
  type updateListSchemaType = z.infer<typeof updateListSchema>;
  const updateListResolver = zodResolver(updateListSchema);

  switch (_action) {
    case "create-todo": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createTodoSchemaType>(request, createTodoResolver);

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        // throw new Error()
        await createTodo({
          title: payload.title,
          description: payload.description,
          dueTime: payload.dueTime,
        });
      } catch (err) {
        return data(
          {
            err,
            payload,
            toastTitle: "Todo Creation Has Been Failed",
            toastContent: "Could not create todo!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "Todo Has Been Created",
        toastContent: "New todo has been added to your list!",
      });
    }

    case "update-todo": {
      const {
        errors,
        data: payloud,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateTodoSchemaType>(request, updateTodoResolver);

      if (errors) {
        return data({ errors, defaultValues, payloud }, { status: 400 });
      }

      try {
        await updateTodo({
          id: payloud.id,
          title: payloud.title,
          description: payloud.description,
          dueTime: payloud.dueTime,
        });
      } catch (err) {
        return Response.json(
          {
            err,
            toastTitle: "Todo Updation Has Been Failed",
            toastContent: "Could not update todo!",
          },
          { status: 400 }
        );
      }
      return Response.json({
        ok: true,
        toastTitle: "Todo Has Been Updated",
        toastContent: "Todo has been updated successfully!",
      });
    }
    case "delete-todo": {
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
    case "complete-todo": {
      const id = await getRequestField("id", request, {
        stringified: false,
      });
      invariant(id);

      try {
        await completeTodo(Number(id));
      } catch (errors) {
        return data(
          {
            errors,
            id,
            toastTitle: "Todo Completion Has Been Failed",
            toastContent: "Could not complete todo!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "Todo Has Been Completed",
        toastContent: "Todo has been completed successfully!",
      });
    }

    case "create-list": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createListSchemaType>(request, createListResolver);

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        // throw new Error()
        await createList({
          title: payload.title,
        });
      } catch (err) {
        return data(
          {
            err,
            payload,
            toastTitle: "List Creation Has Been Failed",
            toastContent: "Could not create List!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "List Has Been Created",
        toastContent: "New List has been added to!",
      });
    }

    default:
      return null;
  }
}
