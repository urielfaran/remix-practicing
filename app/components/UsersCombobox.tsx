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
  value: number;
  form: any;
}

export function UsersCombobox({
  usersWithoutBoardRelation,
  value,
  form,
}: UnrelatedUserComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? usersWithoutBoardRelation.find((user) => user.id === value)
                ?.username
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
                    onSelect={() => {
                      form.setValue("userId", user.id);
                      setOpen(false);
                    }}
                  >
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
