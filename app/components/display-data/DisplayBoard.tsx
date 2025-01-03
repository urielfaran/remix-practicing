import { Prisma } from "@prisma/client";
import { Link } from "react-router";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import EditableText from "../EditableText";
import { Card } from "../ui/card";
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
  const bgType = board.backgroundColor?.startsWith("url") ?? false;
  return (
    <Card
      className={cn("min-w-72 min-h-28 h-fit cursor-pointer group relative", {
        "bg-secondary": board.backgroundColor === null, // Apply 'bg-secondary' if backgroundColor is not defined
        "bg-cover bg-center": bgType, // Apply these if it's an image URL
      })}
      style={{
        ...(board.backgroundColor && bgType // Check if the value is an image URL
          ? {
              backgroundImage: board.backgroundColor, // Apply the image as a background
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : { background: board.backgroundColor || "secondary" }), // Use fallback color if no backgroundColor
      }}
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
          />
        </div>
        {/*make the button visible when clicking it*/}
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
