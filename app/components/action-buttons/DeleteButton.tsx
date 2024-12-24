import { Trash2 } from "lucide-react";
import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { Button } from "../ui/button";

interface DeleteButtonProps {
  id: number;
  action: string;
  text: string;
}
function DeleteButton({ id, action, text }: DeleteButtonProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <fetcher.Form method="POST">
      <input name="id" hidden readOnly value={id} />
      <Button
        name="_action"
        type="submit"
        value={action}
        variant={"ghost"}
        size={"sm"}
        className={
          "relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
        }
      >
        <span>{text}</span>
        <Trash2 className="group-hover:text-red-500" />
      </Button>
    </fetcher.Form>
  );
}

export default DeleteButton;
