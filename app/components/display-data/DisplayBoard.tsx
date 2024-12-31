import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import { Card } from "../ui/card";
import UpdateBoardInput from "../UpdateBoardInput";

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: {
    lists: true;
  };
}>;

interface DisplayListProps {
  board: BoardWithLists;
}

function DisplayBoard({ board }: DisplayListProps) {
  const bg = `${board.backgroundColor ?? "secondary"}`;
  return (
    <Card
      className={"min-w-72 min-h-28 h-fit cursor-pointer group relative"}
      style={{
        background: bg.startsWith("linear-gradient")
          ? bg
          : `var(--color-${bg})`,
      }}
    >
      <Link
        to={`/board/${board.id}/${board.name}`}
        className="absolute inset-0 z-0"
      />
      <div className="p-2 flex flex-row justify-between bg-transparent">
        <div className="relative z-10">
          <UpdateBoardInput board={board} />
        </div>
        {/*make the button visible when click on it*/}
        <div className="invisible group-hover:visible relative z-10">
          <BoardActionDropdown boardId={board.id} />
        </div>
      </div>
      <div className="absolute bottom-2 right-1">
        <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
      </div>
    </Card>
  );
}

export default DisplayBoard;
