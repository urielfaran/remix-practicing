import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Check, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, useFetcher, useNavigate } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { useUsersRelations } from "~/hooks/usersContext";
import { addPermissionsSchema } from "~/schemas/shareBoard.schema";
import { Select } from "./ui/select";
import SelectUserPermission from "./user-components/SelectUserPermission";
import { UsersCombobox } from "./UsersCombobox";
import InfiniteScroller from "./InfiniteScroller";
import UserAvatar from "./user-components/UserAvatar";
import { cn } from "~/lib/utils";

interface AddUserPermissionProps {
  boardId: number;
}

export type ItemsResponse = {
  notifications: User[];
  page: number;
};

export const adddPermissionsResolver = zodResolver(addPermissionsSchema);
export type adddPermissionsSchemaType = z.infer<typeof addPermissionsSchema>;

export function AddUserPermission({ boardId }: AddUserPermissionProps) {
  // const fetcher = useFetcher();
  // useResponseToast(fetcher.data);
  const { getUsersWithoutRelationToBoard, users } = useUsersRelations();

  const usersWithoutRelationToBoard = getUsersWithoutRelationToBoard(
    users,
    boardId
  );

  const defaultValues = {
    permission: undefined,
    userId: undefined,
  };

  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const fetcher = useFetcher<ItemsResponse>();
  const scrollRefContainer = useRef<HTMLDivElement>(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  

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
      const newItems = fetcher.data.notifications;
      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.id));
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevItems, ...uniqueNewItems];
      });
    }
  }, [fetcher.data]);

  const form = useRemixForm<adddPermissionsSchemaType>({
    resolver: adddPermissionsResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      boardId: boardId,
    },
    fetcher: fetcher,
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  return (
    <>
      <ShadForm {...form}>
        <Form
          onSubmit={form.handleSubmit}
          className="flex flex-row gap-5 justify-between"
          action="/action/share-board"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                {/* <UsersCombobox
                  form={form}
                  usersWithoutRelationToBoard={usersWithoutRelationToBoard}
                  value={field.value}
                /> */}
                <InfiniteScroller
                  scrollRefContainer={scrollRefContainer}
                  loadNext={() => {
                    setPage(fetcher.data ? fetcher.data.page + 1 : 1);
                    fetcher.load(
                      `/action/users?page=${page}&boardId=${boardId}&usersStatus=unrelated`
                    );
                  }}
                  loading={fetcher.state === "loading"}
                >
                  <div className="flex flex-col space-y-2">
                    {items.length > 0 ? (
                      items.map((user) => (
                        <div
                          key={user.id}
                          className="p-2 bg-secondary rounded-lg m-1"
                        >
                          <UserAvatar
                            avatarUrl={user.avatar}
                            username={user.username}
                          />
                          {user.username}
                          {/* <Check
                            className={cn(
                              "ml-auto",
                              value === user.id ? "opacity-100" : "opacity-0"
                            )}
                          /> */}
                        </div>
                      ))
                    ) : (
                      <span>No notifications found</span>
                    )}
                    {fetcher.state === "loading" && (
                      <div className="p-2 text-center">Loading more...</div>
                    )}
                  </div>
                </InfiniteScroller>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectUserPermission />
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button className="m-auto" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                Loading...
                <span>
                  <Loader2Icon className="animate-spin" />
                </span>
              </span>
            ) : (
              "Share"
            )}
          </Button>
        </Form>
      </ShadForm>
    </>
  );
}
