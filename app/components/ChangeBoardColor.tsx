import { Board } from "@prisma/client";
import { PropsWithChildren, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import { colors } from "~/utils/colors";
interface ChangeBoardColorProps extends PropsWithChildren {
  board: Board;
}
function ChangeBoardColor({ children, board }: ChangeBoardColorProps) {
  const [chosenBackground, setChosenBackground] = useState("");

  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col gap-2">
        <SheetHeader>
          <SheetTitle>Edit Board Color</SheetTitle>
          <SheetDescription>
            Make changes to your board style here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 p-1">
          {colors.map((color, index) => (
            <Button
              onClick={() => setChosenBackground(color)}
              key={index}
              className={cn("min-h-10", {
                "ring-4 ring-secondary-foreground": chosenBackground === color,
              })}
              style={{
                background: color.startsWith("linear-gradient") ? color : color,
                borderRadius: "4px",
              }}
            />
          ))}
        </div>

        <SheetFooter className="pt-2">
          <SheetClose asChild>
            <fetcher.Form method="POST" action="/action/update-board">
              <Button type="submit">Save changes</Button>
              <input type="text" hidden readOnly value={board.id} name="id" />
              <input
                type="text"
                hidden
                readOnly
                value={chosenBackground}
                name="backgroundColor"
              />
            </fetcher.Form>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ChangeBoardColor;
