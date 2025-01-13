import { UserRoundX } from "lucide-react";
import { useFetcher } from "react-router";
import useResponseToast from "~/hooks/useResponseToast";
import { UserWithBoardRelation } from "../board-components/BoardHeader";
import { Button } from "../ui/button";

interface UserPermissionsFormProps {
  user: UserWithBoardRelation;
  boardId: number;
}

export default function DeleteUserPermissionsForm({
  boardId,
  user,
}: UserPermissionsFormProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  return (
    <fetcher.Form
      method="post"
      className="flex flex-row gap-3 w-full"
      action={"/action/delete-board-permission"}
    >
      <Button type="submit" variant={"ghost"}>
        <UserRoundX />
      </Button>
      <input type="text" hidden readOnly name="userId" value={user.id} />
      <input type="text" hidden readOnly name="boardId" value={boardId} />
    </fetcher.Form>
  );
}
