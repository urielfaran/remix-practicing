import { Check, CheckCircle } from "lucide-react";
import { useFetcher } from "react-router";
import usePlaySound from "~/hooks/usePlaySound";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { Button } from "../ui/button";

interface GenericCompleteButtonProps {
  todoId: number;
  todoCompleteTime: boolean;
  className?: string;
  isActive?: boolean;
}

function GenericCompleteButton({
  todoCompleteTime,
  todoId,
  className,
  isActive = true,
}: GenericCompleteButtonProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  const soundUrl =
    fetcher.data?.toastTitle && fetcher.data.toastTitle.includes("Completed")
      ? "/sounds/complete-sound2.mp3"
      : "";

  usePlaySound({ url: soundUrl });

  return (
    <fetcher.Form method="POST" action="/action/complete-todo">
      <Button
        size={todoCompleteTime ? "icon" : "sm"}
        variant={"ghost"}
        type="submit"
        className={className}
        disabled={!isActive}
      >
        {!todoCompleteTime && <span>Complete Todo</span>}
        {todoCompleteTime ? (
          <CheckCircle className="text-green-400" />
        ) : (
          <Check className="group-hover:text-green-400" />
        )}
      </Button>
      <input type="text" hidden readOnly value={todoId} name="id" />
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

export default GenericCompleteButton;
