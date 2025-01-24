import { Share2 } from "lucide-react";
import { BoardWithRelations } from "./AppSidebar";
import GenericNavItems from "./GenericNavItems";

interface SharedBoardsProps {
  boards: BoardWithRelations[];
}

export function SharedBoards({ boards }: SharedBoardsProps) {
  return <GenericNavItems boards={boards} title={"Shared"} icon={<Share2 />} />;
}
