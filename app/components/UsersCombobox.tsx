import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import InfiniteScroller from "./InfiniteScroller";
import { User } from "@prisma/client";
import { useFetcher, useNavigate } from "react-router";
import { ItemsResponse } from "./dialogs/ShareBoardDialog";

interface UnrelatedUserComboboxProps {
  // usersWithoutRelationToBoard: UserWithBoardRelation[];
  value: number;
  form: any;
  boardId: number;
}

export function UsersCombobox({
  // usersWithoutRelationToBoard,
  value,
  form,
  boardId,
}: UnrelatedUserComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const fetcher = useFetcher<ItemsResponse>();
  const scrollRefContainer = useRef<HTMLDivElement>(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const navigate = useNavigate();

  const filteredUsers = items.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && isFirstOpen) {
      setIsFirstOpen(false);
      fetcher.load(
        `/action/users?page=${page}&boardId=${boardId}&usersStatus=unrelated`
      );
    }
  }, [open, isFirstOpen, fetcher]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") return;

    if (fetcher.data) {
      console.log("data", fetcher.data);
      const newItems = fetcher.data.users;
      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.id));
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevItems, ...uniqueNewItems];
      });
    }
  }, [fetcher.data]);

  const selectedUser = items.find((user) => user.id === value);
  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          navigate(".", { replace: true });
          setItems([]);
          setIsFirstOpen(true);
        }
      }}
    >
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
          <CommandList ref={scrollRefContainer} className="overflow-y-scroll">
            {filteredUsers.length === 0 ? (
              <CommandEmpty>No Users Found</CommandEmpty>
            ) : (
              <CommandGroup>
                <InfiniteScroller
                  scrollRefContainer={scrollRefContainer}
                  loadNext={() => {
                    setPage(fetcher.data ? fetcher.data.page + 1 : 1);
                    console.log(page);
                    fetcher.load(
                      `/action/users?page=${page}&boardId=${boardId}&usersStatus=unrelated`
                    );
                  }}
                  loading={fetcher.state === "loading"}
                >
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
                </InfiniteScroller>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
