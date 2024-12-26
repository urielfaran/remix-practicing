import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import AddListButton from "~/components/action-buttons/AddListButton";
import DisplayList from "~/components/display-data/DisplayList";
import { ScrollArea } from "~/components/ui/scroll-area";
import { createListSchema, updateListSchema } from "~/schemas/listSchema";
import { createTodoSchema, updateTodoSchema } from "~/schemas/todoSchema";
import {
  createList,
  deleteList,
  getAllLists,
  updateList,
} from "~/utils/list.server";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  uncompleteTodo,
  updateTodo,
} from "~/utils/todo.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/board";
import { BoardIdContext } from "~/hooks/itemIdContexts";
export async function loader({ params }: Route.LoaderArgs) {
  const boardId = Number(params.id);
  invariant(boardId, "Invalid boardId");
  // const query = url.searchParams.get("query") || "";
  // const startDateStr = url.searchParams.get("startDate");
  // const endDateStr = url.searchParams.get("endDate");

  // const startDate = startDateStr ? new Date(startDateStr) : undefined;
  // const endDate = endDateStr ? new Date(endDateStr) : undefined;

  // const todos = await getAllToDos({ query, startDate, endDate });
  const lists = await getAllLists(boardId);

  return { lists, boardId };
}

function Board({ loaderData }: Route.ComponentProps) {
  const { lists, boardId } = loaderData;

  return (
    <ScrollArea className="flex min-w-0">
      <div className="flex flex-row gap-9 min-w-0 overflow-x-auto p-4">
        <BoardIdContext.Provider value={boardId}>
          <AddListButton />
        </BoardIdContext.Provider>
        {lists.map((list) => (
          <DisplayList key={list.id} list={list} />
        ))}
      </div>
    </ScrollArea>
  );
}

export default Board;

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
      } = await getValidatedFormData<createTodoSchemaType>(
        request,
        createTodoResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        // throw new Error()
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

    case "update-todo": {
      const {
        errors,
        data: payloud,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateTodoSchemaType>(
        request,
        updateTodoResolver
      );

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

    case "uncomplete-todo": {
      const id = await getRequestField("id", request, {
        stringified: false,
      });
      invariant(id);
      try {
        await uncompleteTodo(Number(id));
      } catch (errors) {
        return data(
          {
            errors,
            id,
            toastTitle: "Todo Uncompletion Has Been Failed",
            toastContent: "Could not uncomplete todo!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "Todo Has Been Uncompleted",
        toastContent: "Todo has been uncomplete successfully!",
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
        await createList({
          title: payload.title,
          boardId: payload.boardId,
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
    case "update-list": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateListSchemaType>(
        request,
        updateListResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        // throw new Error()
        await updateList({
          title: payload.title,
          id: payload.id,
        });
      } catch (err) {
        return data(
          {
            err,
            payload,
            toastTitle: "List Updation Has Been Failed",
            toastContent: "Could not update List!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "List Has Been Updated",
        toastContent: "List has been updated successfully!",
      });
    }
    case "delete-list": {
      const id = await getRequestField("id", request, {
        stringified: false,
      });
      invariant(id);

      try {
        await deleteList(Number(id));
      } catch (errors) {
        return data(
          {
            errors,
            id,
            toastTitle: "List Deletion Has Been Failed",
            toastContent: "Could not delete List!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "List Has Been Deleted",
        toastContent: "List has been deleted successfully!",
      });
    }
    default:
      return null;
  }
}