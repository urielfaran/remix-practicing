import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { getBackgroundStyle } from "~/utils/backgrounds";
import { Permissions } from "~/utils/permissions";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import EditableText from "../EditableText";
import { Card } from "../ui/card";

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: {
    lists: true;
    UserBoardRelation: {
      select: {
        isFavorite: true;
      };
    };
  };
}>;

interface DisplayListProps {
  board: BoardWithLists;
  permissions: number;
}

function DisplayBoard({ board, permissions }: DisplayListProps) {
  const { className, style } = getBackgroundStyle(board.backgroundColor);

  const isDeletePermission =
    (permissions & Permissions.DELETE) === Permissions.DELETE;
  const isFavorite = board.UserBoardRelation[0].isFavorite;

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
          <EditableText
            actionName="/action/update-board"
            id={board.id}
            text={board.name}
            fieldName="name"
            isEditable={isDeletePermission}
          />
        </div>
        {/*make the button visible when clicking it*/}
        <div className="invisible group-hover:visible relative z-10">
          <BoardActionDropdown
            boardId={board.id}
            isActive={isDeletePermission}
          />
        </div>
      </div>
      <div className="absolute bottom-2 right-1">
        <FavoriteBoard boardId={board.id} isFavorite={isFavorite} />
      </div>
    </Card>
  );
}

export default DisplayBoard;
