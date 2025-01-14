import { PropsWithChildren } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import FilterTodosForm from "../forms/FilterTodosForm";
import { UserWithBoardRelation } from "../board-components/BoardHeader";

interface FilterTodosSheetProps extends PropsWithChildren {
  users: UserWithBoardRelation[]
}
export function FilterTodosSheet({users, children }: FilterTodosSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Your Todos</SheetTitle>
        </SheetHeader>
        <FilterTodosForm users={users}/>
      </SheetContent>
    </Sheet>
  );
}
