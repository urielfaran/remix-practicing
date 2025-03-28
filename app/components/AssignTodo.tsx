import { PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Form } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UserWithTodo } from "~/hooks/conncetedUsersContext";
import { useInfiniteScroller } from "~/hooks/useInfiniteScroller";
import useResponseToast from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import { userIdSchema } from "~/schemas/shareBoard.schema";
import { UserWithBoardRelation } from "./board-components/BoardHeader";
import { Input } from "./ui/input";
import UserAvatar from "./user-components/UserAvatar";

export const addUserResolver = zodResolver(userIdSchema);
export type addUserSchemaType = z.infer<typeof userIdSchema>;

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
  const form = useRemixForm<addUserSchemaType>({
    resolver: addUserResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      todoid: todoId,
    },
  });

  const {
    scrollContainer,
    setIsOpen,
    items,
    loadData,
    setInputValue,
    hasMore,
  } = useInfiniteScroller<UserWithBoardRelation>({
    apiRoute: "/api/get-users",
    additionalQuery: `userStatus=NOT_ASSIGNED_TO_TODO&todoId=${todoId}`,
  });


  return (
    <ShadForm {...form}>
      <Form
        onSubmit={(e) => {
          console.log(e);
          form.handleSubmit}}
        className="flex flex-row gap-5 justify-between"
        action="/action/add-todo-assignment"
        navigate= {false}
      >
        <button type="submit">rtesd</button>
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
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
                              className="flex justify-between p-1 hover:bg-muted cursor-pointer"
                              key={id}
                              onClick={() => {
                                form.setValue("userId", id); // Set the userId value
                                // form.handleSubmit(); // Trigger the form submission
                              }} // Trigger submission on click
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
      </Form>
    </ShadForm>
  );
}

export default AssignTodo;