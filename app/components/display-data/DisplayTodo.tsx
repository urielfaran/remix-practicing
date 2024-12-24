import { Todo } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { Ban, Ellipsis } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import UncompleteTodoButton from "../action-buttons/UncompleteTodoButton";
import TodoActionDropdown from "../dropdowns/TodoActionDropdown";
import TodoForm from "../forms/TodoForm";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import DeleteButton from "../action-buttons/DeleteButton";
import CompleteTodoButton from "../action-buttons/CompleteTodoButton";
import EditTodoButton from "../action-buttons/EditTodoButton";
import GenericActionDropdown from "../dropdowns/GenericActionDropdown";

interface DisplayTodoProps {
  todo: Todo;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function TodoDisplay({ todo, isEditing, setIsEditing }: DisplayTodoProps) {
  const isLate = differenceInDays(todo.dueTime, new Date()) < 0;

  const todoActions = [
    <DeleteButton id={todo.id} action='"delete-todo"' text="Delete Todo" />,
    <CompleteTodoButton id={todo.id} />,
    <EditTodoButton isEditing={isEditing} setIsEditing={setIsEditing} />,
  ];

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <CardTitle className="flex-1 outline-none">{todo.title}</CardTitle>
        {/* <TodoActionDropdown
          todoId={todo.id}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        >
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </TodoActionDropdown> */}
        <GenericActionDropdown actions={todoActions} label="Todo Actions">
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </GenericActionDropdown>
      </div>

      <CardDescription className="space-y-3">
        <p>{todo.description}</p>
        <div className="flex justify-between items-center">
          {todo.completeTime && <UncompleteTodoButton todo={todo} />}
          <div className="flex-1 flex justify-end">
            <Button variant={isLate ? "destructive" : "outline"}>
              {format(todo.dueTime, "dd.MM.yyyy")}
            </Button>
          </div>
        </div>
      </CardDescription>
    </>
  );
}

function TodoCard({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      key={todo.id}
      className={cn("grid min-w-48 m-2 p-5 hover:ring-2", {
        "ring-2 ring-green-500": todo.completeTime,
      })}
    >
      {isEditing ? (
        <TodoForm action={"Update"} todo={todo} />
      ) : (
        <TodoDisplay
          todo={todo}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      {isEditing ? (
        <Button
          className="mt-auto max-w-full"
          onClick={() => setIsEditing(!isEditing)}
          variant={"destructive"}
        >
          <>
            <span>Cancel</span>
            <Ban />
          </>
        </Button>
      ) : null}
    </Card>
  );
}

export default TodoCard;
