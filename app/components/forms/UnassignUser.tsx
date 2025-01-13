import { X } from "lucide-react";
import { useFetcher } from "react-router";
import useResponseToast from "~/hooks/useResponseToast";
import { Button } from "../ui/button";

interface UnassignUserProps {
  userId: number;
  todoId: number;
}
function UnassignUser({ todoId, userId }: UnassignUserProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  return (
    <fetcher.Form
      method="post"
      className="flex flex-row gap-3 w-full"
      action={"/action/delete-todo-assignment"}
    >
      <Button type="submit" variant={"ghost"}>
        <X />
      </Button>
      <input type="text" hidden readOnly name="userId" value={userId} />
      <input type="text" hidden readOnly name="todoId" value={todoId} />
    </fetcher.Form>
  );
}

export default UnassignUser;
