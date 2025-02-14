import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
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
import { permissionType, shareBoardSchema } from "~/schemas/shareBoard.schema";
import {
  adddPermissionsResolver,
  adddPermissionsSchemaType,
} from "../AddUserPermission";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import UpdateUserPermissionTable from "../UpdateUserPermissionTable";
import InfiniteScroller from "../InfiniteScroller";
import UserAvatar from "../user-components/UserAvatar";
import { Select } from "../ui/select";
import SelectUserPermission from "../user-components/SelectUserPermission";
import { UsersCombobox } from "../UsersCombobox";

export type ItemsResponse = {
  users: User[];
  page: number;
};

interface ShareBoardDialogProps extends PropsWithChildren {
  boardId: number;
}

export const shareBoardResolver = zodResolver(shareBoardSchema);
export type shareBoardType = z.infer<typeof shareBoardSchema>;

export const permissionTypeResolver = zodResolver(permissionType);
export type permissionType = z.infer<typeof permissionType>;

function ShareBoardDialog({ children, boardId }: ShareBoardDialogProps) {
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

  // useEffect(() => {
  //   if (open && isFirstOpen) {
  //     setIsFirstOpen(false);
  //     fetcher.load(
  //       `/action/users?page=${page}&boardId=${boardId}&usersStatus=unrelated`
  //     );
  //   }
  // }, [open, isFirstOpen, fetcher]);

  // useEffect(() => {
  //   if (!fetcher.data || fetcher.state === "loading") return;

  //   if (fetcher.data) {
  //     console.log("data", fetcher.data);
  //     const newItems = fetcher.data.users;
  //     setItems((prevItems) => {
  //       const existingIds = new Set(prevItems.map((item) => item.id));
  //       const uniqueNewItems = newItems.filter(
  //         (item) => !existingIds.has(item.id)
  //       );
  //       return [...prevItems, ...uniqueNewItems];
  //     });
  //   }
  // }, [fetcher.data]);

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
    <Dialog
      open={open}
      onOpenChange={() => setOpen(!open)}
      // onOpenChange={(isOpen) => {
      //   setOpen(isOpen);
      //   if (!isOpen) {
      //     navigate(".", { replace: true });
      //     setItems([]);
      //     setIsFirstOpen(true);
      //   }
      // }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="min-w-[425px] min-h-60 max-h-96 overflow-y-scroll flex flex-col space-y-3"
        // ref={scrollRefContainer}
      >
        <DialogTitle>Share Your Board With Other Users</DialogTitle>
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
                  <UsersCombobox
                    boardId={boardId}
                    form={form}
                    value={field.value}
                  />
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
        {/* <AddUserPermission
          boardId={boardId}
        /> */}
        <Separator />
        <UpdateUserPermissionTable boardId={boardId} />
      </DialogContent>
    </Dialog>
  );
}

export default ShareBoardDialog;
