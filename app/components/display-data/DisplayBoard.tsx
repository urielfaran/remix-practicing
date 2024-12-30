import { Prisma } from "@prisma/client";
import { Link } from "react-router";
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
  console.log(bg, board.backgroundColor);
  return (
    <Card
      className={"min-w-72 min-h-28 h-fit cursor-pointer group relative"}
      style={{
        background: bg.startsWith("linear-gradient")
          ? bg
          : `var(--color-${bg})`
      }}
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
