import { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UsersCombobox } from "../UsersCombobox";
import { User } from "@prisma/client";
import { Form, useFetcher } from "react-router";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { permissionType, shareBoardSchema } from "~/schemas/shareBoard.schema";
import { useRemixForm } from "remix-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Loader2Icon } from "lucide-react";

interface ShareBoardDialogProps extends PropsWithChildren {
  users: User[];
  boardId: number;
}

export const shareBoardResolver = zodResolver(shareBoardSchema);
export type shareBoardType = z.infer<typeof shareBoardSchema>;

export const permissionTypeResolver = zodResolver(permissionType);
export type permissionTypeType = z.infer<typeof permissionType>;

function ShareBoardDialog({ children, users, boardId }: ShareBoardDialogProps) {
  const fetcher = useFetcher();
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const defaultValues = {
    // userId: userId,
    // boardId: boardId,
    type: undefined,
  };

  const form = useRemixForm<permissionTypeType>({
    resolver: permissionTypeResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      _action: "/action/share-board",
      boardId: boardId,
      userId: userId,
    },
    fetcher: fetcher,
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[425px] min-h-40"
      >
        <DialogTitle>Share Your Board With Other Users</DialogTitle>
        <UsersCombobox users={users} userId={userId} setUserId={setUserId} />
        <ShadForm {...form}>
          <Form onSubmit={form.handleSubmit} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="view" />
                        </FormControl>
                        <FormLabel className="font-normal">Viewer</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="edit" />
                        </FormControl>
                        <FormLabel className="font-normal">Editor</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="delete" />
                        </FormControl>
                        <FormLabel className="font-normal">Creator</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="text" name="boardId" hidden readOnly value={boardId} />
            <input type="text" name="userId" hidden readOnly value={userId} />
            <Button
              variant="default"
              className="m-1 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Loading...
                  <span>
                    <Loader2Icon className="animate-spin" />
                  </span>
                </span>
              ) : (
                "Share Board"
              )}
            </Button>
          </Form>
        </ShadForm>
      </DialogContent>
    </Dialog>
  );
}

export default ShareBoardDialog;
