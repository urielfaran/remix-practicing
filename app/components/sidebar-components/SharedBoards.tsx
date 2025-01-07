import { Board } from "@prisma/client";
import { Share2 } from "lucide-react";
import GenericNavItems from "./GenericNavItems";

interface SharedBoardsProps {
  boards: Board[];
}

export function SharedBoards({ boards }: SharedBoardsProps) {
  return (
    <GenericNavItems boards={boards} title={"Shared"} icon={<Share2 />} />
  );
}
