import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import { Card } from "../ui/card";
import UpdateBoardInput from "../UpdateBoardInput";
import clsx from "clsx";
import { cn } from "~/lib/utils";

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: {
    lists: true;
  };
}>;

interface DisplayListProps {
  board: BoardWithLists;
}
function DisplayBoard({ board }: DisplayListProps) {
  const bg = `bg-${board.backgroundColor ?? "secondary"}`; 

  return (
    <Card
      className={clsx(
        "min-w-72 min-h-28 h-fit cursor-pointer group relative",
        bg
      )}
    >
      <Link
        to={`/board/${board.id}/${board.name}`}
        className="absolute inset-0 z-0"
      />
      <div className="p-2 flex flex-row justify-center bg-transparent relative z-10">
        <UpdateBoardInput board={board} />
        <div className="invisible group-hover:visible">
          <BoardActionDropdown boardId={board.id} />
        </div>
      </div>
    </Card>
  );
}

export default DisplayBoard;
