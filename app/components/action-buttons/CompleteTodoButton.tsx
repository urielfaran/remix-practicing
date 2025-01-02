import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";

interface CompleteTodoProps {
  id: number;
  todoCompleteTime: boolean;
}
function CompleteTodoButton({ id, todoCompleteTime }: CompleteTodoProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);
  return (
    <fetcher.Form method="POST" action="/action/complete-todo">
      <Button
        size={"sm"}
        variant={"ghost"}
        type="submit"
        // name="_action"
        // value='"complete-todo"'
        className="relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
      >
        <span>Complete Todo</span>
        <Check className="group-hover:text-green-400" />
      </Button>
      <input type="text" hidden readOnly value={id} name="id" />
      <input
        type="text"
        hidden
        readOnly
        name="is-completed"
        value={todoCompleteTime ? "true" : "false"}
      />
    </fetcher.Form>
  );
}

export default CompleteTodoButton;
