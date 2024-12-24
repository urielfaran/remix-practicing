import { Todo } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { Ban, Ellipsis } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import TodoActionDropdown from "../dropdowns/TodoActionDropdown";
import TodoForm from "../forms/TodoForm";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface DisplayTodoProps {
  todo: Todo;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function TodoDisplay({ todo, isEditing, setIsEditing }: DisplayTodoProps) {
  const isLate = differenceInDays(todo.dueTime, new Date()) < 0;
  return (
    <>
      <div className="flex flex-row justify-between">
        <CardTitle className="m-2 flex-1 outline-none">
          Title: {todo.title}
        </CardTitle>
        <TodoActionDropdown
          todoId={todo.id}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        >
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </TodoActionDropdown>
      </div>

      <CardDescription className="space-y-2">
        <p>Description: {todo.description}</p>
        <p>
          Due Time:{" "}
          <span
            className={cn("", {
              "text-red-500 font-bold": isLate,
            })}
          >
            {format(todo.dueTime, "dd.MM.yyyy")}
          </span>
        </p>
      </CardDescription>
    </>
  );
}

function TodoCard({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card key={todo.id} className="grid gap-2 min-h-48 min-w-48 m-2 p-5 hover:ring-2">
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
