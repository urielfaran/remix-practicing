import { Todo } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { differenceInDays, format } from "date-fns";
import { Ban, FilePenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import CompleteTodo from "./CompleteTodo";
import TodoForm from "./TodoForm";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";

interface DisplayTodoProps {
  todo: Todo;
}

function TodoDisplay({ todo }: { todo: Todo }) {
  const isLate = differenceInDays(todo.dueTime, new Date()) < 0;
  return (
    <>
      <div className="flex flex-row justify-between">
        <CardTitle>Title: {todo.title}</CardTitle>
        <CompleteTodo id={todo.id} />
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

function DeleteButton({ id }: { id: number }) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <fetcher.Form method="POST">
      <input name="id" hidden readOnly value={id} />
      <Button
        name="_action"
        type="submit"
        value='"delete-todo"'
        variant={"destructive"}
        className="w-full"
      >
        Delete
        <Trash2 />
      </Button>
    </fetcher.Form>
  );
}
function TodoCard({ todo }: DisplayTodoProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      key={todo.id}
      className="grid gap-2 min-h-80 min-w-48 m-2 p-5"
    >
      {isEditing ? (
        <TodoForm action={"Update"} todo={todo} />
      ) : (
        <>
          <TodoDisplay todo={todo} />
        </>
      )}
      <div className="mt-auto grid gap-2 w-full max-w-full">
        <Button
          className="mt-auto max-w-full"
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "destructive" : "default"}
        >
          {isEditing ? (
            <>
              <span>Cancel</span>
              <Ban />
            </>
          ) : (
            <>
              <span>Edit</span>
              <FilePenLine />
            </>
          )}
        </Button>
        {!isEditing && <DeleteButton id={todo.id} />}
      </div>
    </Card>
  );
}

export default TodoCard;
