import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { permissionsArray } from "~/schemas/shareBoard.schema";
import { UserWithBoardRelation } from "./BoardHeader";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Form, useFetcher } from "react-router";
import useResponseToast from "~/hooks/useResponseToast";
import { useRemixForm } from "remix-hook-form";
import {
  permissionTypeResolver,
  permissionTypeType,
} from "./dialogs/ShareBoardDialog";

interface UpdateUserPermissionTableProps {
  usersWithBoardRelation: UserWithBoardRelation[];
}
function UpdateUserPermissionTable({
  usersWithBoardRelation,
}: UpdateUserPermissionTableProps) {
  const fetcher = useFetcher();
  // const [userId, setUserId] = useState<number | undefined>(undefined);
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User name</TableHead>
          <TableHead className="text-right">Permissions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersWithBoardRelation.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell className="text-right">
              <ShadForm {...form}>
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
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {permissionsArray.map((permission) => (
                                  <SelectItem
                                    key={permission.value}
                                    value={permission.value}
                                  >
                                    {permission.key}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </ShadForm>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UpdateUserPermissionTable;
