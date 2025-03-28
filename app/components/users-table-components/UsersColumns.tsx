import { ColumnDef } from "@tanstack/react-table";
import { useBoardStore } from "~/utils/board-store";
import { UserWithBoardRelation } from "../board-components/BoardHeader";
import DeleteUserPermissionsForm from "../forms/DeleteUserPermissionsForm";
import UpdateUserPermissionsForm from "../forms/UpdateUserPermissionsForm";
import UserAvatar from "../user-components/UserAvatar";

// generic actions to take care the following operations
// create
// edit
export const actionColumns = (): ColumnDef<UserWithBoardRelation>[] => [
  {
    accessorKey: "select",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const board = useBoardStore((state) => state.board);

      return (
        <div className="flex justify-center">
          <UpdateUserPermissionsForm boardId={board!.id} user={row.original} />
          <DeleteUserPermissionsForm boardId={board!.id} user={row.original} />
        </div>
      );
    },
    size: 100,
  },
];

export function usersColumns(
  additionalColumns: ColumnDef<UserWithBoardRelation>[]
): ColumnDef<UserWithBoardRelation>[] {
  return [
    ...additionalColumns,
    {
      accessorKey: "username",
      header: "username",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <UserAvatar
              avatarUrl={row.original.avatar}
              username={row.original.username}
            />
            <p className="text-gray-800 font-medium text-sm">
              {row.original.username}
            </p>
          </div>
        );
      },
    },
  ];
}
