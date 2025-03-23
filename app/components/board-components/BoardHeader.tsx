import { Prisma } from "@prisma/client";
import { Image, ListFilter, UsersRound } from "lucide-react";
import { useBoardStore } from "~/utils/board-store";
import { Permissions, usePermissionStore } from "~/utils/permissions";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import ChangeBoardColor from "../ChangeBoardColor";
import ShareBoardDialog from "../dialogs/ShareBoardDialog";
import EditableText from "../EditableText";
import { FilterTodosSheet } from "../filter-components/FilterTodosSheet";
import { Button } from "../ui/button";
import SelectDataView from "./SelectDataView";

export type BoardWithData = Prisma.BoardGetPayload<{
  include: {
    lists: {
      include: {
        todos: {
          include: {
            labels: true;
          };
        };
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

function BoardHeader() {
  const board = useBoardStore((state) => state.board);

  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );
  const isDeletePermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.DELETE)
  );

  return (
    <>
      {board ? (
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

            <FavoriteBoard
              boardId={board.id}
              isFavorite={board.UserBoardRelation[0].isFavorite}
            />
            <SelectDataView/>
          </div>
          <div className="flex flex-row mr-2 gap-3">
            <ShareBoardDialog>
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
            <ChangeBoardColor>
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
          </div>
        </div>
      ) : null}
    </>
  );
}

export default BoardHeader;
