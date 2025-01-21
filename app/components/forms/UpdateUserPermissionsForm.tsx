import { UserRoundPen } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Select } from "~/components/ui/select";
import useResponseToast from "~/hooks/useResponseToast";
import { UserWithBoardRelation } from "../board-components/BoardHeader";
import {
  permissionType,
  permissionTypeResolver,
} from "../dialogs/ShareBoardDialog";
import { Button } from "../ui/button";
import SelectUserPermission from "../user-components/SelectUserPermission";

interface UserPermissionsFormProps {
  user: UserWithBoardRelation;
  boardId: number;
}

export default function UpdateUserPermissionsForm({
  boardId,
  user,
}: UserPermissionsFormProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  const userCurrentPermission = user.UserBoardRelation.find((relation) => {
    return relation.boardId === boardId;
  })?.permissions.toString();

  const defaultValues = {
    permission: userCurrentPermission,
  };

  const form = useRemixForm<permissionType>({
    resolver: permissionTypeResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      boardId: boardId,
      userId: user.id,
    },
    fetcher: fetcher,
    defaultValues,
  });

  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        method="post"
        className="flex flex-row gap-3 w-full"
        action={"/action/update-board-permission"}
      >
        <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={userCurrentPermission}
                >
                  <SelectUserPermission />
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"ghost"}>
          <UserRoundPen />
        </Button>
      </Form>
    </ShadForm>
  );
}
