import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { Todo } from "@prisma/client";

interface UncompleteTodoButtonProps {
  todo: Todo;
}

function UncompleteTodoButton({ todo }: UncompleteTodoButtonProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <fetcher.Form method="POST">
      <Button
        type="submit"
        size={"icon"}
        variant={"ghost"}
        name="_action"
        value='"uncomplete-todo"'
      >
        <CheckCircle className="text-green-400" />
      </Button>
      <input type="text" hidden readOnly name="id" value={todo.id} />
    </fetcher.Form>
  );
}

export default UncompleteTodoButton;
