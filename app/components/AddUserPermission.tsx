import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Loader2Icon } from "lucide-react";
import { Form, useFetcher } from "react-router";
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
import useResponseToast from "~/hooks/useResponseToast";
import { useUsersRelations } from "~/hooks/usersContext";
import { addPermissionsSchema } from "~/schemas/shareBoard.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SelectUserPermission from "./user-components/SelectUserPermission";
import { UsersCombobox } from "./UsersCombobox";
import { useBoardStore } from "~/utils/board-store";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteUserScroller } from "~/hooks/useInfiniteUserScroller";
import { User } from "@prisma/client";
import UserAvatar from "./user-components/UserAvatar";
import { Input } from "./ui/input";

export const addPermissionsResolver = zodResolver(addPermissionsSchema);
export type addPermissionsSchemaType = z.infer<typeof addPermissionsSchema>;

export function AddUserPermission() {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  const board = useBoardStore((state) => state.board);

  const { getUsersWithoutRelationToBoard, users } = useUsersRelations();

  const usersWithoutRelationToBoard = getUsersWithoutRelationToBoard(
    users,
    board!.id
  );

  const defaultValues = {
    permission: undefined,
    userId: undefined,
  };

  const form = useRemixForm<addPermissionsSchemaType>({
    resolver: addPermissionsResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      boardId: board!.id,
    },
    fetcher: fetcher,
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const { items, inputValue, isLoading, loadMore, setInputValue } =
  useInfiniteUserScroller<User>({
    actionUrl: "/api/get-users", 
    userStatus: "NOT_ASSIGNED_TO_BOARD",
  });
  console.log(items);

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
                <Select
                  value={field.value?.toString() ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full"
                    />
                    <div id="scrollableDiv">
                      <InfiniteScroll
                        dataLength={items.length}
                        next={loadMore}
                        hasMore={true}
                        loader={
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p className="text-center p-2 text-gray-500">
                            No more items to load
                          </p>
                        }
                      >
                        {items.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item?.id?.toString()}
                          >
                            {item.username}
                            <UserAvatar
                              avatarUrl={item.avatar}
                              username={item.username}
                            />
                          </SelectItem>
                        ))}
                      </InfiniteScroll>
                    </div>
                  </SelectContent>
                </Select>
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
