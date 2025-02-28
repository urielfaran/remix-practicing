import { Prisma } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { Calendar, Pencil, UserRoundPlus } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { ConncetedUsersContext } from "~/hooks/conncetedUsersContext";
import { cn } from "~/lib/utils";
import { Permissions, usePermissionStore } from "~/utils/permissions";
import AssignTodo from "../AssignTodo";
import EditTodoDialog, { dialogStyleType } from "../dialogs/EditTodoDialog";
import { DraggableCard } from "../DraggableCard";
import TodoActionDropdown from "../dropdowns/TodoActionDropdown";
import UpdateTodoDueTime from "../dropdowns/UpdateTodoDueTime";
import TodoStatusIcon from "../TodoStatusIcon";
import { Button } from "../ui/button";
import { CardDescription, CardTitle } from "../ui/card";
import UpdateTodoStatus from "../UpdateTodoStatus";
import UserAvatar from "../user-components/UserAvatar";
import DisplayLabels from "./DisplayLabels";

export type todoWithLabels = Prisma.TodoGetPayload<{
  include: {
    labels: true;
  };
}>;

interface DisplayTodoProps {
  todo: todoWithLabels;
  dialogStyle: dialogStyleType;
}

interface TodoCardProps {
  todo: todoWithLabels;
  todos: todoWithLabels[];
  index: number;
}

export function TodoDisplay({ todo, dialogStyle }: DisplayTodoProps) {
  const isLate = todo.dueTime && differenceInDays(todo.dueTime, new Date()) < 0;

  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );
  const connectedUsers = useContext(ConncetedUsersContext);

  const assignUsers = connectedUsers.filter((user) =>
    user.Todos.some((todoItem) => todoItem.id === todo.id)
  );

  const noAssigendUsers = connectedUsers.filter(
    (user) => !user.Todos.some((todoItem) => todoItem.id === todo.id)
  );

  return (
    <>
      <DisplayLabels
        labels={todo.labels}
        todoId={todo.id}
        dialogStyle={dialogStyle}
      />
      <div className="flex flex-row justify-between items-center group relative z-10">
        <CardTitle className="flex-1 outline-none">{todo.title}</CardTitle>
        <AssignTodo
          todoId={todo.id}
          assignUsers={assignUsers}
          noAssigendUsers={noAssigendUsers}
        >
          <Button
            size={"sm"}
            disabled={!isEditPermission}
            variant={"ghost"}
            className="invisible group-hover:visible"
          >
            <UserRoundPlus />
          </Button>
        </AssignTodo>
        <EditTodoDialog todo={todo} dialogStyle={dialogStyle}>
          <Button
            size={"sm"}
            disabled={!isEditPermission}
            variant={"ghost"}
            className="invisible group-hover:visible"
          >
            <Pencil />
          </Button>
        </EditTodoDialog>
        {!todo.completeTime && (
          <TodoActionDropdown todoId={todo.id} isActive={isEditPermission} />
        )}
      </div>
      <CardDescription className="space-y-3">
        <div className="flex justify-between">
          <p>{todo.description}</p>
          <UpdateTodoStatus currentStatus={todo.status} todoId={todo.id}>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-inherit focus-visible:ring-0"
            >
              <TodoStatusIcon status={todo.status} />
            </Button>
          </UpdateTodoStatus>
        </div>
        <div className="flex justify-between">
          <UpdateTodoDueTime todoId={todo.id}>
            <Button
              variant={isLate ? "destructive" : "ghost"}
              className={cn("", {
                "bg-green-600 hover:bg-green-700 text-white": todo.completeTime,
              })}
              size={"sm"}
              disabled={!isEditPermission}
            >
              <Calendar />
              {todo.dueTime && format(todo.dueTime, "MMM d, yyyy")}
            </Button>
          </UpdateTodoDueTime>
          <div className="max-w-28 flex relative -space-x-4">
            {assignUsers.map((user) => (
              <AssignTodo
                key={user.id}
                todoId={todo.id}
                assignUsers={assignUsers}
                noAssigendUsers={noAssigendUsers}
              >
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="hover:bg-inherit focus-visible:ring-0"
                >
                  <UserAvatar
                    avatarUrl={user.avatar}
                    username={user.username}
                  />
                </Button>
              </AssignTodo>
            ))}
          </div>
        </div>
      </CardDescription>
    </>
  );
}

function TodoCard({ todo, todos, index }: TodoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [dialogStyle, setDialogStyle] = useState({
    top: 0,
    left: 0,
    width: "auto",
  });

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDialogStyle({
        top: rect.top + window.scrollY, // Position below the card
        left: rect.left,
        width: `${rect.width}px`, // Match the card's width
      });
    }
  }, [cardRef.current]);

  return (
    <DraggableCard
      key={todo.id}
      title={todo.title}
      id={todo.id}
      order={todo.order}
      columnId={todo.listId}
      previousOrder={todos[index - 1] ? todos[index - 1].order : 0}
      nextOrder={todos[index + 1] ? todos[index + 1].order : todo.order + 1}
      actionUrl="/action/change-todo-list"
    >
      <TodoDisplay todo={todo} dialogStyle={dialogStyle} />
    </DraggableCard>
  );
}

export default TodoCard;
