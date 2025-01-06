import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import EditableText from "../EditableText";
import { Card } from "../ui/card";
import { cn } from "~/lib/utils";
import { getBackgroundStyle } from "~/utils/backgrounds";
import { hasPermission, Permissions } from "~/utils/permissions";

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: {
    lists: true;
  };
}>;

export type UserWithPermissions = Prisma.UserGetPayload<{
  include: {
    UserBoardPermission: true;
  };
}>;

interface DisplayListProps {
  board: BoardWithLists;
  user: UserWithPermissions;
}

function DisplayBoard({ board, user }: DisplayListProps) {
  const { className, style } = getBackgroundStyle(board.backgroundColor);

  const isDeletePermission = hasPermission(
    user.UserBoardPermission[0].permissions,
    Permissions.DELETE
  );
  const isEditPermission = hasPermission(
    user.UserBoardPermission[0].permissions,
    Permissions.WRITE
  );

  return (
    <Card
      className={cn("min-w-72 min-h-28 h-fit cursor-pointer group relative", {
        className,
      })}
      style={style}
    >
      <Link
        to={`/board/${board.id}/${board.name}`}
        className="absolute inset-0 z-0"
      />
      <div className="p-2 flex flex-row justify-between bg-transparent">
        <div className="relative z-10 p-2">
          {isDeletePermission ? (
            <EditableText
              actionName="/action/update-board"
              id={board.id}
              text={board.name}
              fieldName="name"
            />
          ) : (
            board.name
          )}
        </div>
        {/*make the button visible when clicking it*/}
        {isDeletePermission && ( 
          <div className="invisible group-hover:visible relative z-10">
            <BoardActionDropdown boardId={board.id} />
          </div>
        )}
      </div>
      <div className="absolute bottom-2 right-1">
        <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
      </div>
    </Card>
  );
}

export default DisplayBoard;
