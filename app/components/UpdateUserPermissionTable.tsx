import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserIdContext } from "~/hooks/itemIdContexts";
import { useUsersRelations } from "~/hooks/usersContext";
import { useBoardStore } from "~/utils/board-store";
import DeleteUserPermissionsForm from "./forms/DeleteUserPermissionsForm";
import UpdateUserPermissionsForm from "./forms/UpdateUserPermissionsForm";
import UserAvatar from "./user-components/UserAvatar";

function UpdateUserPermissionTable() {
  const userId = useContext(UserIdContext);

  const board = useBoardStore((state) => state.board);

  const { getUsersWithRelationToBoard, users } = useUsersRelations();

  const usersWithRelationToBoard = getUsersWithRelationToBoard(
    users,
    board!.id,
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
              <UpdateUserPermissionsForm boardId={board!.id} user={user} />
              <DeleteUserPermissionsForm boardId={board!.id} user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UpdateUserPermissionTable;
