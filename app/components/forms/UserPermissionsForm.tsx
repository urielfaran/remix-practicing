import { UserRoundPen, UserRoundX } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useResponseToast from "~/hooks/useResponseToast";
import { permissionsArray } from "~/schemas/shareBoard.schema";
import { UserWithBoardRelation } from "../BoardHeader";
import {
  permissionTypeResolver,
  permissionTypeType,
} from "../dialogs/ShareBoardDialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface UserPermissionsFormProps {
  user: UserWithBoardRelation;
  boardId: number;
}

export default function UserPermissionsForm({
  boardId,
  user,
}: UserPermissionsFormProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);
  const [isUpdate, setIsUpdate] = useState(false);

  const defaultValues = {
    permission: user.UserBoardRelation[0].permissions.toString(),
  };

  const form = useRemixForm<permissionTypeType>({
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
        action={
          isUpdate
            ? "/action/update-board-permission"
            : "/action/delete-board-permission"
        }
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
                  defaultValue={user.UserBoardRelation[0].permissions.toString()}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select user permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {permissionsArray.map((permission, index) => (
                        <SelectItem key={index} value={permission.value}>
                          {permission.key}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setIsUpdate(true)}
            type="submit"
            variant={"ghost"}
            name="_action"
            value={'"update-board-permission"'}
          >
            <UserRoundPen />
          </Button>
          <Button
            onClick={() => setIsUpdate(false)}
            type="submit"
            variant={"ghost"}
            name="_action"
            value={'"delete-board-permission"'}
          >
            <UserRoundX />
          </Button>
        </div>
      </Form>
    </ShadForm>
  );
}
