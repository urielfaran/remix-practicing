import { Board } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import FavoriteBoard from "./action-buttons/FavoriteBoard";
import BoardSettings from "./BoardSettings";
import { Button } from "./ui/button";

interface BoardHeaderProps {
  board: Board;
}
function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <div className="bg-background/20 backdrop-filter backdrop-blur-sm p-3 flex flex-row justify-between">
      <div className="flex flex-row ml-2 gap-3">
        <p className="font-bold text-xl">
          {board.name.charAt(0).toUpperCase() + board.name.slice(1)}
        </p>
        <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
      </div>
      <div className="flex flex-row mr-2 gap-3">
        <BoardSettings>
          <Button variant={'ghost'} className="hover:bg-inherit hover:scale-125 transition delay-150 duration-300 ease-in-out">
            <Ellipsis />
          </Button>
        </BoardSettings>
      </div>
    </div>
  );
}

export default BoardHeader;
