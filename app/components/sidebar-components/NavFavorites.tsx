import { Board } from "@prisma/client";
import { Star } from "lucide-react";
import GenericNavItems from "./GenericNavItems";

interface FavoriteBoardsProps {
  boards: Board[];
}

export function FavoriteBoards({ boards }: FavoriteBoardsProps) {
  return (
    <GenericNavItems boards={boards} title={"Favorites"} icon={<Star />} />
  );
}
