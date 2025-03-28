import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Check, ChevronsUpDown, Loader2, Loader2Icon } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
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
import { useInfiniteScroller } from "~/hooks/useInfiniteScroller";
import useResponseToast from "~/hooks/useResponseToast";
import { useUsersRelations } from "~/hooks/usersContext";
import { addPermissionsSchema } from "~/schemas/shareBoard.schema";
import { useBoardStore } from "~/utils/board-store";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SelectUserPermission from "./user-components/SelectUserPermission";
import UserAvatar from "./user-components/UserAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "~/lib/utils";

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

  const {
    scrollContainer,
    setIsOpen,
    items,
    loadData,
    setInputValue,
    hasMore,
  } = useInfiniteScroller<User>({
    apiRoute: "/api/get-users",
    additionalQuery: "userStatus=NOT_ASSIGNED_TO_BOARD",
  });

  return (
    <>
      <ShadForm {...form}>
      <Form
        onSubmit={(e) => {
          console.log(e);
          form.handleSubmit}}
          className="flex flex-row gap-5 justify-between"
          action="/action/share-board"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover onOpenChange={setIsOpen}>
                  <PopoverTrigger className="min-w-40">
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? items.find((item) => item.id === field.value)
                              ?.username
                          : "select user"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 max-h-[400px] overflow-y-auto">
                    <div>
                      <Input
                        placeholder="search user"
                        className="h-9"
                        onChange={(e) => {
                          setInputValue(e.target.value);
                        }}
                      />
                      <div ref={scrollContainer}>
                        <InfiniteScroll
                          dataLength={items.length}
                          next={loadData}
                          hasMore={hasMore}
                          loader={null}
                          scrollableTarget={"scroll-element"}
                        >
                          <div
                            className="h-36 overflow-y-scroll"
                            id="scroll-element"
                          >
                            {items.map(({ id, avatar, username }) => (
                              <div
                                className="flex justify-between p-1 hover:bg-muted"
                                key={id}
                                onClick={() => {
                                  form.setValue("userId", id);
                                }}
                              >
                                <div className="flex flex-row gap-2">
                                  <UserAvatar
                                    avatarUrl={avatar}
                                    username={username}
                                  />
                                  {username}
                                </div>

                                <Check
                                  className={cn(
                                    id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </InfiniteScroll>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-right" />
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
