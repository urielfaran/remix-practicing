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
import { useContext } from "react";
import { UserIdContext } from "~/hooks/itemIdContexts";
import { usersRelations } from "~/hooks/usersContext";

interface UpdateUserPermissionTableProps {
  boardId: number;
}
function UpdateUserPermissionTable({
  boardId,
}: UpdateUserPermissionTableProps) {
  const userId = useContext(UserIdContext);

  const { getUsersWithRelationToBoard, users } = usersRelations();

  const usersWithRelationToBoard = getUsersWithRelationToBoard(
    users,
    boardId,
    userId
  );

  return (
    <Table className="min-w-full rounded-lg shadow-lg">
      <TableHeader className="sticky top-0 z-10 bg-muted">
        <TableRow className="hover:bg-inherit w-full">
          <TableHead className="px-4 py-2 text-left font-semibold text-sm">
            User
          </TableHead>
          <TableHead className="px-4 py-2 text-right font-semibold text-sm">
            Permissions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersWithRelationToBoard.map((user) => (
          <TableRow key={user.id} className="">
            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-3">
                <UserAvatar avatarUrl={user.avatar} username={user.username} />
                <p className="text-gray-800 font-medium text-sm">
                  {user.username}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-right flex gap-3 items-end">
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
