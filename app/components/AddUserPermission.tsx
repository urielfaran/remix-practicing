import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
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
import { addPermissionsSchema } from "~/schemas/shareBoard.schema";
import { UserWithBoardRelation } from "./BoardHeader";
import { UsersCombobox } from "./UsersCombobox";
import { Select } from "./ui/select";
import SelectUserPermission from "./user-components/SelectUserPermission";

interface AddUserPermissionProps {
  usersWithoutBoardRelation: UserWithBoardRelation[];
  boardId: number;
}

export const adddPermissionsResolver = zodResolver(addPermissionsSchema);
export type adddPermissionsSchemaType = z.infer<typeof addPermissionsSchema>;

export function AddUserPermission({
  usersWithoutBoardRelation,
  boardId,
}: AddUserPermissionProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  const defaultValues = {
    permission: undefined,
    userId: undefined,
  };

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
                <UsersCombobox
                  form={form}
                  usersWithoutBoardRelation={usersWithoutBoardRelation}
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
          <Button
            className="m-auto"
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
              "Share"
            )}
          </Button>
        </Form>
      </ShadForm>
    </>
  );
}
