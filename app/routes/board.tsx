import { Prisma } from "@prisma/client";
import { useEffect } from "react";
import { ActionFunctionArgs, data, redirect, useParams } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import BoardHeader from "~/components/board-components/BoardHeader";
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
import Lists from "~/components/main-components/Lists";
import TodoCalendar from "~/components/main-components/TodoCalendar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserIdContext } from "~/hooks/itemIdContexts";
import { UsersProvider } from "~/hooks/usersContext";
import { cn } from "~/lib/utils";
import { getBackgroundStyle } from "~/utils/backgrounds";
import { useBoardStore } from "~/utils/board-store";
import { createList } from "~/utils/list.server";
import { usePermissionStore } from "~/utils/permissions";
import { createTodo, getLastOrder, updateTodo } from "~/utils/todo.server";
import { getActiveUsers, getUserWithBoardById } from "~/utils/user.server";
import { getGroupedParamsByType, getRequestField } from "~/utils/utils";
import type { Route } from "./+types/board";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: params.name }];
}

export type FullBoard = Prisma.BoardGetPayload<{
  include: {
    UserBoardRelation: { include: { user: { include: { Todos: true } } } };
    lists: { include: { todos: { include: { labels: true } } } };
  };
}>;

export async function loader({ params, request }: Route.LoaderArgs) {
  const boardId = Number(params.id);
  invariant(boardId, "Invalid boardId");

  const stringlifiedUserId = await authenticator.requireUser(request, "/login");

  const userId = Number(stringlifiedUserId);

  const url = new URL(request.url);

  const paramsByType = getGroupedParamsByType(url);

  const user = await getUserWithBoardById(userId, boardId, paramsByType);

  invariant(user, "board doesnt exist");

  if (!user.UserBoardRelation) redirect("/");

  const { board, permissions } = user?.UserBoardRelation[0] ?? {};

  const users = await getActiveUsers(userId);

  return { board, permissions, users, userId };
}

function Board({ loaderData }: Route.ComponentProps) {
  const { board, permissions, users, userId } = loaderData;
  const { className, style } = getBackgroundStyle(board.backgroundColor);
  const setPermissions = usePermissionStore((state) => state.setPermissions);
  const setBoard = useBoardStore((state) => state.setBoard);

  useEffect(() => {
    setPermissions(permissions);
    setBoard(board);
  }, [board, permissions, setBoard, setPermissions]);

  const { data } = useParams();
  const renderContent = () => {
    switch (data) {
      case "calendar": {
        return <TodoCalendar board={board} />;
      }
      default: {
        return <Lists board={board} />;
      }
    }
  };
  return (
    <ScrollArea
      className={cn("flex min-w-0 h-screen overflow-y-hidden", className)}
      style={style}
    >
      <UsersProvider value={users}>
        <UserIdContext.Provider value={userId}>
          <div className="sticky top-0">
            <BoardHeader />
          </div>
        </UserIdContext.Provider>
      </UsersProvider>
      {renderContent()}
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
        const newOrder = await getLastOrder(payload.listId);

        await createTodo({
          ...payload,
          order: newOrder,
          status: "NOT_STARTED",
        });
      } catch (err) {
        console.log(err);
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
          dueTime: payload.dueTime || null,
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
