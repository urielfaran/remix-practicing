import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserWithBoardRelation } from "./board-components/BoardHeader";
import UpdateUserPermissionsForm from "./forms/UpdateUserPermissionsForm";
import UserAvatar from "./user-components/UserAvatar";
import DeleteUserPermissionsForm from "./forms/DeleteUserPermissionsForm";

interface UpdateUserPermissionTableProps {
  usersWithRelationToBoard: UserWithBoardRelation[];
  boardId: number;
}
function UpdateUserPermissionTable({
  usersWithRelationToBoard,
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
        {usersWithRelationToBoard.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium gap-2">
              <div className="flex gap-2">
                <UserAvatar avatarUrl={user.avatar} username={user.username} />
                <p>{user.username}</p>
              </div>
            </TableCell>
            <TableCell className="content-right flex flex-row items-end">
              <UpdateUserPermissionsForm boardId={boardId} user={user} />
              <DeleteUserPermissionsForm boardId={boardId} user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UpdateUserPermissionTable;
