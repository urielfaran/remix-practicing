import _ from "lodash";
import { useEffect } from "react";
import { ActionFunctionArgs, data, redirect } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import AddListButton from "~/components/action-buttons/AddListButton";
import BoardHeader from "~/components/board-components/BoardHeader";
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
import { ConncetedUsersContext } from "~/hooks/conncetedUsersContext";
import { BoardIdContext, UserIdContext } from "~/hooks/itemIdContexts";
import { UsersProvider } from "~/hooks/usersContext";
import { cn } from "~/lib/utils";
import { getBackgroundStyle } from "~/utils/backgrounds";
import { createList } from "~/utils/list.server";
import { usePermissionStore } from "~/utils/permissions";
import { createTodo, updateTodo } from "~/utils/todo.server";
import { getActiveUsers, getUserWithBoardById } from "~/utils/user.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/board";
import { getNotifications } from "~/utils/notofications.server";
import NotificationsPopover from "~/components/NotificationsPopover";
import { Button } from "~/components/ui/button";
import { Bell } from "lucide-react";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: params.name }];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const boardId = Number(params.id);
  invariant(boardId, "Invalid boardId");

  const userId = await authenticator.requireUser(request, "/login");

  const url = new URL(request.url);
  const groupedParams = _.groupBy(
    url.searchParams.getAll("filter"),
    (param) => param.split(":")[0]
  );

  const result = _.mapValues(groupedParams, (group) =>
    group.map((item) => item.split(":")[1])
  );

  const user = await getUserWithBoardById(Number(userId), boardId, result);
  invariant(user, "board doesnt exist");

  if (!user.UserBoardRelation) redirect("/");

  const { board, permissions } = user?.UserBoardRelation[0] ?? {};

  const users = await getActiveUsers(Number(userId));

  const page = Number(url.searchParams.get("page") || 0);

  const notifications = await getNotifications(Number(userId), page);

  return { board, permissions, users, userId, notifications, page };
}

function Board({ loaderData }: Route.ComponentProps) {
  const { board, permissions, users, userId, notifications, page } = loaderData;
  const { className, style } = getBackgroundStyle(board.backgroundColor);
  const setPermissions = usePermissionStore((state) => state.setPermissions);

  useEffect(() => {
    setPermissions(permissions);
  }, [permissions]);

  const connectedusers = board.UserBoardRelation.map(
    (relation) => relation.user
  );
  const notificationsExist = notifications.length > 0;

  return (
    <ScrollArea className={cn("flex min-w-0 h-full", className)} style={style}>
      {/* <UserPermissionProvider value={permissions}> */}
      <UsersProvider value={users}>
        <UserIdContext.Provider value={Number(userId)}>
          <BoardHeader board={board} />
        </UserIdContext.Provider>
      </UsersProvider>
      {/* <NotificationsPopover notifications={notifications} currentPage={page}>
        <Button size={"icon"} variant={"ghost"}>
          <Bell
            className={cn("text-blue-500", {
              "text-red-500": notificationsExist,
            })}
          />
          {notificationsExist ? notifications.length : null}
        </Button>
      </NotificationsPopover> */}
      <div className="flex flex-row gap-9 min-w-0 overflow-x-auto p-4">
        <BoardIdContext.Provider value={board?.id}>
          <AddListButton />
        </BoardIdContext.Provider>
        <ConncetedUsersContext.Provider value={connectedusers}>
          {board.lists.map((list) => (
            <DisplayList key={list.id} list={list} />
          ))}
        </ConncetedUsersContext.Provider>
      </div>
      {/* </UserPermissionProvider> */}
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
          status: "NOT_STARTED",
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
