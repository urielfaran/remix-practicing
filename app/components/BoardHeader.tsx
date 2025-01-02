import { Board } from "@prisma/client";
import { Image } from "lucide-react";
import FavoriteBoard from "./action-buttons/FavoriteBoard";
import ChangeBoardColor from "./ChangeBoardColor";
import EditableText from "./EditableText";
import { Button } from "./ui/button";

interface BoardHeaderProps {
  board: Board;
}
function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <div className="bg-background/20 backdrop-filter backdrop-blur-sm p-3 flex flex-row justify-between">
      <div className="flex flex-row ml-2 gap-3">
        <EditableText
          actionName="/action/update-board"
          id={board.id}
          text={board.name}
          className="font-bold text-xl"
          fieldName="name"
        />

        <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
      </div>
      <div className="flex flex-row mr-2 gap-3">
        <ChangeBoardColor board={board}>
          <Button
            variant={"default"}
            className="hover:scale-105 transition delay-150 duration-300 ease-in-out"
          >
            <Image />
            Change Color
          </Button>
        </ChangeBoardColor>
      </div>
    </div>
  );
}

export default BoardHeader;
