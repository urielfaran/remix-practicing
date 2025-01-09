import { useState } from "react";
import { useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import useResponseToast from "~/hooks/useResponseToast";
import { UserWithBoardRelation } from "./BoardHeader";
import {
  permissionTypeResolver,
  permissionTypeType,
} from "./dialogs/ShareBoardDialog";
import UpdateUserPermissionTable from "./UpdateUserPermissionTable";

interface UpdateUserPermissionProps {
  usersWithBoardRelation: UserWithBoardRelation[];
  boardId: number;
}

function UpdateUserPermission({
  boardId,
  usersWithBoardRelation,
}: UpdateUserPermissionProps) {
  const fetcher = useFetcher();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  useResponseToast(fetcher.data);

  const defaultValues = {
    permission: undefined,
  };

  const form = useRemixForm<permissionTypeType>({
    resolver: permissionTypeResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      boardId: boardId,
      userId: userId,
    },
    fetcher: fetcher,
    defaultValues,
  });

  const { isSubmitting } = form.formState;
  return (
    <>
      <UpdateUserPermissionTable
        usersWithBoardRelation={usersWithBoardRelation}
      />
      {/* <ShadForm {...form}>
        <Form
          onSubmit={form.handleSubmit}
          className="w-2/3 space-y-6"
          action="/action/share-board"
        >
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Choose Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {permissionsArray.map(({ key, value }, index) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={index}
                      >
                        <FormControl>
                          <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{key}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
      </ShadForm> */}
    </>
  );
}

export default UpdateUserPermission;
