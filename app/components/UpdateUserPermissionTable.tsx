import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserWithBoardRelation } from "./BoardHeader";
import UserPermissionsForm from "./forms/UserPermissionsForm";
import UserAvatar from "./user-components/UserAvatar";

interface UpdateUserPermissionTableProps {
  usersWithBoardRelation: UserWithBoardRelation[];
  boardId: number;
}
function UpdateUserPermissionTable({
  usersWithBoardRelation,
  boardId,
}: UpdateUserPermissionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User</TableHead>
          <TableHead className="text-center">Permissions</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersWithBoardRelation.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium gap-2">
              <div className="flex gap-2">
                <UserAvatar avatarUrl={user.avatar} username={user.username} />
                <p>{user.username}</p>
              </div>
            </TableCell>
            <TableCell className="content-right flex flex-col items-center">
              <UserPermissionsForm boardId={boardId} user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UpdateUserPermissionTable;
