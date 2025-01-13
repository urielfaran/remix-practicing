import { PropsWithChildren, useState } from "react";

import { useFetcher } from "react-router";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UserWithTodo } from "~/hooks/conncetedUsersContext";
import useResponseToast from "~/hooks/useResponseToast";
import UnassignUser from "./forms/UnassignUser";
import UserAvatar from "./user-components/UserAvatar";

interface AssignTodoProps extends PropsWithChildren {
  todoId: number;
  assignUsers: UserWithTodo[];
  noAssigendUsers: UserWithTodo[];
}

function AssignTodo({
  children,
  todoId,
  assignUsers,
  noAssigendUsers,
}: AssignTodoProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-52 p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Search User..." />
          <CommandList>
            <CommandEmpty>No Users found.</CommandEmpty>
            <CommandGroup heading="Assigned">
              {assignUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      avatarUrl={user.avatar}
                      username={user.username}
                    />
                    {user.username}
                  </div>
                  <div className="ml-auto">
                    <UnassignUser todoId={todoId} userId={user.id} />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Suggested">
              {noAssigendUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    fetcher.submit(
                      { userId: currentValue, todoId: todoId.toString() },
                      { method: "post", action: "/action/add-todo-assignment" }
                    );
                    setOpen(false);
                  }}
                >
                  <UserAvatar
                    avatarUrl={user.avatar}
                    username={user.username}
                  />
                  {user.username}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AssignTodo;
