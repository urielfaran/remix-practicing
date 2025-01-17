import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { UserWithBoardRelation } from "./board-components/BoardHeader";
import UserAvatar from "./user-components/UserAvatar";

interface UnrelatedUserComboboxProps {
  usersWithoutRelationToBoard: UserWithBoardRelation[];
  value: number;
  form: any;
}

export function UsersCombobox({
  usersWithoutRelationToBoard,
  value,
  form,
}: UnrelatedUserComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const filteredUsers = usersWithoutRelationToBoard.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );
  const selectedUser = usersWithoutRelationToBoard.find(
    (user) => user.id === value
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[180px] justify-between"
        >
          {value && selectedUser?.username
            ? selectedUser?.username
            : "Select user"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[180px] p-0">
        <Command>
          <CommandInput
            placeholder="Search user..."
            className="h-9"
            value={search ?? null}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <CommandList>
            {filteredUsers.length === 0 ? (
              <CommandEmpty>No Users Found</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      form.setValue("userId", user.id);
                      setOpen(false);
                    }}
                  >
                    <UserAvatar
                      avatarUrl={user.avatar}
                      username={user.username}
                    />
                    {user.username}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
