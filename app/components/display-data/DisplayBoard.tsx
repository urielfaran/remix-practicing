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
  return (
    <Card className="min-w-72 min-h-28 bg-secondary h-fit cursor-pointer group">
      <div className="p-2 flex flex-row justify-center bg-transparent relative z-10">
        <UpdateBoardInput board={board} />
        <div className="invisible group-hover:visible">
          <BoardActionDropdown boardId={board.id} />
        </div>
        <Link
          to={`/board/${board.id}/${board.name}`}
          // className="absolute inset-0"
          // aria-hidden="true"
        ></Link>
      </div>
    </Card>
  );
}

export default DisplayBoard;
