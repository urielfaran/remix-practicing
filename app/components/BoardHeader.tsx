import { Prisma } from "@prisma/client";
import { Image, UsersRound } from "lucide-react";
import { usePermission } from "~/hooks/permissionsContext";
import { Permissions } from "~/utils/permissions";
import FavoriteBoard from "./action-buttons/FavoriteBoard";
import ChangeBoardColor from "./ChangeBoardColor";
import ShareBoardDialog from "./dialogs/ShareBoardDialog";
import EditableText from "./EditableText";
import { Button } from "./ui/button";

export type BoardWithRelations = Prisma.BoardGetPayload<{
  include: {
    lists: {
      include: {
        todos: true;
      };
    };
    UserBoardRelation: true;
  };
}>;

export type UserWithBoardRelation = Prisma.UserGetPayload<{
  include: {
    UserBoardRelation: true;
  };
}>;

interface BoardHeaderProps {
  board: BoardWithRelations;
  users: UserWithBoardRelation[];
}
function BoardHeader({ board, users }: BoardHeaderProps) {
  const { checkPermission } = usePermission();
  const isEditPermission = checkPermission(Permissions.WRITE);
  const isDeletePermission = checkPermission(Permissions.DELETE);

  const isFavorite = board.UserBoardRelation[0].isFavorite;

  return (
    <div className="bg-background/20 backdrop-filter backdrop-blur-sm p-3 flex flex-row justify-between">
      <div className="flex flex-row ml-2 gap-3">
        <EditableText
          actionName="/action/update-board"
          id={board.id}
          text={board.name}
          className="font-bold text-xl"
          fieldName="name"
          isEditable={isDeletePermission}
        />

        <FavoriteBoard boardId={board.id} isFavorite={isFavorite} />
      </div>
      <div className="flex flex-row mr-2 gap-3">
        <ShareBoardDialog users={users} boardId={board.id}>
          <Button variant={"ghost"} size={"sm"} disabled={!isDeletePermission}>
            <UsersRound />
            Share Board
          </Button>
        </ShareBoardDialog>
        <ChangeBoardColor board={board}>
          <Button
            variant={"default"}
            size={"sm"}
            className="hover:scale-105 transition delay-150 duration-300 ease-in-out"
            disabled={!isEditPermission}
          >
            <Image />
            Change Background
          </Button>
        </ChangeBoardColor>
      </div>
    </div>
  );
}

export default BoardHeader;
