import { Board } from "@prisma/client";
import { Star } from "lucide-react";
import GenericNavItems from "./GenericNavItems";
import { BoardWithRelations } from "./AppSidebar";

interface FavoriteBoardsProps {
  boards: BoardWithRelations[];
}

export function FavoriteBoards({ boards }: FavoriteBoardsProps) {
  return (
    <GenericNavItems boards={boards} title={"Favorites"} icon={<Star />} />
  );
}
