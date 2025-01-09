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
import { UserWithBoardRelation } from "./BoardHeader";

interface UnrelatedUserComboboxProps {
  usersWithoutBoardRelation: UserWithBoardRelation[];
  userId: number | undefined;
  setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export function UnrelatedUserCombobox({
  usersWithoutBoardRelation,
  userId,
  setUserId,
}: UnrelatedUserComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);

  // const usersWithBoardRelation = users.filter((user) =>
  //   user.UserBoardRelation.some((relation) => relation.boardId === boardId)
  // );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {userId
            ? usersWithoutBoardRelation.find((user) => user.id === userId)?.username
            : "Select user..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandList>
            {usersWithoutBoardRelation.length === 0 ? (
              <CommandEmpty>No Users Found</CommandEmpty>
            ) : (
              <CommandGroup>
                {usersWithoutBoardRelation.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id.toString()}
                    onSelect={(currentValue) => {
                      setUserId(
                        Number(currentValue) === userId
                          ? undefined
                          : Number(currentValue)
                      );
                      setOpen(false);
                    }}
                  >
                    {user.username}
                    <Check
                      className={cn(
                        "ml-auto",
                        userId === user.id ? "opacity-100" : "opacity-0"
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
