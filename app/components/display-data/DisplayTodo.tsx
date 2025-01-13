import { Todo } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { Calendar, Pencil, UserRoundPlus } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { usePermission } from "~/hooks/permissionsContext";
import { cn } from "~/lib/utils";
import { Permissions } from "~/utils/permissions";
import GenericCompleteButton from "../action-buttons/GenericCompleteButton";
import AssignTodo from "../AssignTodo";
import EditTodoDialog, { dialogStyleType } from "../dialogs/EditTodoDialog";
import TodoActionDropdown from "../dropdowns/TodoActionDropdown";
import UpdateTodoDueTime from "../dropdowns/UpdateTodoDueTime";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { ConncetedUsersContext } from "~/hooks/conncetedUsersContext";
import UserAvatar from "../user-components/UserAvatar";

interface TodoCardProps {
  todo: Todo;
}

type DisplayTodoProps = TodoCardProps & { dialogStyle: dialogStyleType };

function TodoDisplay({ todo, dialogStyle }: DisplayTodoProps) {
  const isLate = differenceInDays(todo.dueTime, new Date()) < 0;

  const { checkPermission } = usePermission();
  const isEditPermission = checkPermission(Permissions.WRITE);

  const connectedUsers = useContext(ConncetedUsersContext);

  const assignUsers = connectedUsers.filter((user) =>
    user.Todos.some((todoItem) => todoItem.id === todo.id)
  );

  const noAssigendUsers = connectedUsers.filter(
    (user) => !user.Todos.some((todoItem) => todoItem.id === todo.id)
  );

  return (
    <>
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
          <TodoActionDropdown
            todoId={todo.id}
            todoCompleteTime={todo.completeTime ? true : false}
            isActive={isEditPermission}
          />
        )}
      </div>
      <CardDescription className="space-y-3">
        <p>{todo.description}</p>
        <div className="flex justify-between items-center">
          {todo.completeTime && (
            <GenericCompleteButton
              todoCompleteTime={todo.completeTime ? true : false}
              todoId={todo.id}
              isActive={isEditPermission}
            />
          )}
          <div className="flex justify-start">
            {assignUsers.map((user) => (
              <AssignTodo
                key={user.id}
                todoId={todo.id}
                assignUsers={assignUsers}
                noAssigendUsers={noAssigendUsers}
              >
                <Button size={'icon'} variant={'ghost'}>
                  <UserAvatar
                    avatarUrl={user.avatar}
                    username={user.username}
                  />
                </Button>
              </AssignTodo>
            ))}
          </div>
          <div className="flex justify-end">
            <UpdateTodoDueTime todoId={todo.id}>
              <Button
                variant={isLate ? "destructive" : "ghost"}
                className={cn("", {
                  "bg-green-600 hover:bg-green-700 text-white":
                    todo.completeTime,
                })}
                size={"sm"}
                disabled={!isEditPermission}
              >
                <Calendar />
                {format(todo.dueTime, "MMM d, yyyy")}
              </Button>
            </UpdateTodoDueTime>
          </div>
        </div>
      </CardDescription>
    </>
  );
}

function TodoCard({ todo }: TodoCardProps) {
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
    <Card
      key={todo.id}
      ref={cardRef}
      className={cn("relative grid min-w-48 p-2 hover:ring-2")}
    >
      <TodoDisplay todo={todo} dialogStyle={dialogStyle} />
    </Card>
  );
}

export default TodoCard;
