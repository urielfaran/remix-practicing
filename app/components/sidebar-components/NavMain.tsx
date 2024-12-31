import { Board } from "@prisma/client";
import { Clipboard } from "lucide-react";
import GenericNavItems from "./GenericNavItems";

export function NavMain({ boards }: { boards: Board[] }) {
  return (
    <GenericNavItems boards={boards} title={"Boards"} icon={<Clipboard />} />
  );
}
