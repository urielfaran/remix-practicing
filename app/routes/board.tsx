import { ActionFunctionArgs, data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import AddListButton from "~/components/action-buttons/AddListButton";
import BoardHeader from "~/components/BoardHeader";
import DisplayList from "~/components/display-data/DisplayList";
import {
  updateTodoContentResolver,
  updateTodoContentSchemaType,
} from "~/components/dropdowns/UpdateTodoContent";
import {
  updateTodoDueTimeResolver,
  updateTodoDueTimeSchemaType,
} from "~/components/dropdowns/UpdateTodoDueTime";
import {
  createListResolver,
  createListSchemaType,
} from "~/components/forms/ListForm";
import {
  createTodoResolver,
  createTodoSchemaType,
} from "~/components/forms/TodoForm";
import { ScrollArea } from "~/components/ui/scroll-area";
import { BoardIdContext } from "~/hooks/itemIdContexts";
import { getBoard } from "~/utils/board.server";
import { createList } from "~/utils/list.server";
import { createTodo, updateTodo } from "~/utils/todo.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/board";
import { cn } from "~/lib/utils";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: params.name }];
}
export async function loader({ params }: Route.LoaderArgs) {
  const boardId = Number(params.id);
  invariant(boardId, "Invalid boardId");
  // const query = url.searchParams.get("query") || "";
  // const startDateStr = url.searchParams.get("startDate");
  // const endDateStr = url.searchParams.get("endDate");

  // const startDate = startDateStr ? new Date(startDateStr) : undefined;
  // const endDate = endDateStr ? new Date(endDateStr) : undefined;

  // const todos = await getAllToDos({ query, startDate, endDate });
  const board = await getBoard(boardId);

  invariant(board, "board doesnt exist");

  return { board };
}

function Board({ loaderData }: Route.ComponentProps) {
  const { board } = loaderData;

  const bg = `${board.backgroundColor ?? "secondary"}`;
  const bgType = board.backgroundColor?.startsWith("url") ?? false;

  return (
    <ScrollArea
      className={cn("flex min-w-0 h-full", {
        bgType: "bg-cover bg-center",
      })}
      style={{
        ...(bgType // Check if the value is an image URL
          ? {
              backgroundImage: bg, // Apply the image as a background
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : { background: bg }), // Otherwise, apply as a color gradient
      }}
    >
      <BoardHeader board={board} />
      <div className="flex flex-row gap-9 min-w-0 overflow-x-auto p-4">
        <BoardIdContext.Provider value={board?.id}>
          <AddListButton />
        </BoardIdContext.Provider>
        {board.lists.map((list) => (
          <DisplayList key={list.id} list={list} />
        ))}
      </div>
    </ScrollArea>
  );
}

export default Board;

export async function action({ request }: ActionFunctionArgs) {
  const _action = await getRequestField("_action", request);

  switch (_action) {
    case "create-todo": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createTodoSchemaType>(
        request,
        createTodoResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        await createTodo({
          title: payload.title,
          description: payload.description,
          dueTime: payload.dueTime,
          listId: payload.listId,
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

    case "update-todo-content": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateTodoContentSchemaType>(
        request,
        updateTodoContentResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }

      try {
        await updateTodo({
          id: payload.id,
          title: payload.title,
          description: payload.description || "",
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
    case "update-todo-due-time": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateTodoDueTimeSchemaType>(
        request,
        updateTodoDueTimeResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }

      try {
        await updateTodo({
          id: payload.id,
          dueTime: payload.dueTime,
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
    case "create-list": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createListSchemaType>(
        request,
        createListResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        await createList(payload);
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
