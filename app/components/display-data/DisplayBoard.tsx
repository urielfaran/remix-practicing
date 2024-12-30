import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import { Card } from "../ui/card";
import UpdateBoardInput from "../UpdateBoardInput";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: {
    lists: true;
  };
}>;

interface DisplayListProps {
  board: BoardWithLists;
}

function DisplayBoard({ board }: DisplayListProps) {
  console.log(board)
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
        <div onClick={(e) => e.stopPropagation()} className="relative z-10">
          <UpdateBoardInput board={board} />
        </div>
        <div
          className="invisible group-hover:visible relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <BoardActionDropdown boardId={board.id} />
        </div>
      </div>
      <Button className="flex right-1 bottom-1" variant={'ghost'} size={'sm'}>
        <Star className={`${board.isFavorite ? 'text-yellow-400' : ''}`}/>
      </Button>
    </Card>
  );
}

export default DisplayBoard;
