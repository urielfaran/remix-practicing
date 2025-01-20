import { Prisma } from "@prisma/client";
import { Image, ListFilter, UsersRound } from "lucide-react";
import { BoardIdContext } from "~/hooks/itemIdContexts";
import { Permissions, usePermissionStore } from "~/utils/permissions";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import ChangeBoardColor from "../ChangeBoardColor";
import ShareBoardDialog from "../dialogs/ShareBoardDialog";
import EditableText from "../EditableText";
import { FilterTodosSheet } from "../filter-components/FilterTodosSheet";
import { Button } from "../ui/button";

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
}
function BoardHeader({ board }: BoardHeaderProps) {
  const isFavorite = board.UserBoardRelation[0].isFavorite;

  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );
  const isDeletePermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.DELETE)
  );

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
        <ShareBoardDialog boardId={board.id}>
          <Button
            variant={"ghost"}
            size={"sm"}
            disabled={!isDeletePermission}
            className="hover:scale-105 transition delay-100 duration-200 ease-in-out"
          >
            <UsersRound />
            Share Board
          </Button>
        </ShareBoardDialog>
        <ChangeBoardColor board={board}>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:scale-105 transition delay-100 duration-200 ease-in-out"
            disabled={!isEditPermission}
          >
            <Image />
            Change Background
          </Button>
        </ChangeBoardColor>
        <BoardIdContext.Provider value={board.id}>
          <FilterTodosSheet>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="hover:scale-105 transition delay-100 duration-200 ease-in-out"
              disabled={!isEditPermission}
            >
              <ListFilter />
              Filter
            </Button>
          </FilterTodosSheet>
        </BoardIdContext.Provider>
      </div>
    </div>
  );
}

export default BoardHeader;
