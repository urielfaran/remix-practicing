import { PropsWithChildren } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import FilterTodosForm from "../forms/FilterTodosForm";

interface FilterTodosSheetProps extends PropsWithChildren {
}
export function FilterTodosSheet({children }: FilterTodosSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Your Todos</SheetTitle>
        </SheetHeader>
        <FilterTodosForm />
      </SheetContent>
    </Sheet>
  );
}
