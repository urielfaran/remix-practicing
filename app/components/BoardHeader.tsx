import { Board, User } from "@prisma/client";
import { Image, Share } from "lucide-react";
import FavoriteBoard from "./action-buttons/FavoriteBoard";
import ChangeBoardColor from "./ChangeBoardColor";
import EditableText from "./EditableText";
import { Button } from "./ui/button";
import { hasPermission, Permissions } from "~/utils/permissions";
import ShareBoardDialog from "./dialogs/ShareBoardDialog";

interface BoardHeaderProps {
  board: Board;
  permissions: number;
  users: User[];
}
function BoardHeader({ board, permissions, users }: BoardHeaderProps) {
  const isEditPermission = hasPermission(permissions, Permissions.WRITE);
  const isDeletePermission = hasPermission(permissions, Permissions.DELETE);

  return (
    <div className="bg-background/20 backdrop-filter backdrop-blur-sm p-3 flex flex-row justify-between">
      <div className="flex flex-row ml-2 gap-3">
        {isEditPermission ? (
          <EditableText
            actionName="/action/update-board"
            id={board.id}
            text={board.name}
            className="font-bold text-xl"
            fieldName="name"
          />
        ) : (
          <p className="font-bold text-xl">{board.name}</p>
        )}

        <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
      </div>
      <div className="flex flex-row mr-2 gap-3">
        {isDeletePermission && (
          <ShareBoardDialog users={users} boardId= {board.id}>
            <Button variant={"ghost"} size={"sm"}>
              Share Board
              <Share />
            </Button>
          </ShareBoardDialog>
        )}
        {isEditPermission && (
          <ChangeBoardColor board={board}>
            <Button
              variant={"default"}
              size={'sm'}
              className="hover:scale-105 transition delay-150 duration-300 ease-in-out"
            >
              <Image />
              Change Background
            </Button>
          </ChangeBoardColor>
        )}
      </div>
    </div>
  );
}

export default BoardHeader;
