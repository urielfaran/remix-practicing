import { Status } from "@prisma/client";
import { PropsWithChildren, useState } from "react";
import { useFetcher } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useResponseToast from "~/hooks/useResponseToast";
import TodoStatusIcon from "./TodoStatusIcon";
import { Button } from "./ui/button";
import usePlaySound from "~/hooks/usePlaySound";
interface UpdateTodoStatus extends PropsWithChildren {
  currentStatus: Status;
  todoId: number;
}

const statusArray = Object.values(Status);

function UpdateTodoStatus({
  children,
  currentStatus,
  todoId,
}: UpdateTodoStatus) {
  const [status, setStatus] = useState(currentStatus);
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  // const soundUrl = status === "COMPLETED" ? "/sounds/complete-sound.mp3" : "";

  // usePlaySound({ url: soundUrl });

  return (
    <fetcher.Form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Todo Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(e) => {
              setStatus(e as keyof typeof Status);
              fetcher.submit(
                { status: e, id: todoId },
                { method: "post", action: "/action/update-todo-status" }
              );
            }}
          >
            {statusArray.map((stat, index) => (
              <DropdownMenuRadioItem
                key={index}
                value={stat}
                className="flex gap-2"
              >
                {stat.toLowerCase().replace("_", " ")}
                <div className="ml-auto">
                  <TodoStatusIcon status={stat} />
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </fetcher.Form>
  );
}

export default UpdateTodoStatus;
