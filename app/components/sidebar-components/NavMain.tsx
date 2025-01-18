import { Clipboard } from "lucide-react";
import { BoardWithRelations } from "./AppSidebar";
import GenericNavItems from "./GenericNavItems";

export function NavMain({ boards }: { boards: BoardWithRelations[] }) {
  return (
    <GenericNavItems boards={boards} title={"Boards"} icon={<Clipboard />} />
  );
}
