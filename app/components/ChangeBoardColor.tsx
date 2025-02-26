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
import { backgrounds } from "~/utils/backgrounds";
import { useBoardStore } from "~/utils/board-store";

interface ChangeBoardColorProps extends PropsWithChildren {}

function ChangeBoardColor({ children }: ChangeBoardColorProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  const board = useBoardStore((state) => state.board);
  if (!board) return null;
  const { id, backgroundColor } = board;

  const [chosenBackground, setChosenBackground] = useState(backgroundColor);

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
          {backgrounds.map((bg, index) => (
            <Button
              onClick={() => setChosenBackground(bg)}
              key={index}
              className={cn("min-h-16", {
                "ring-4 ring-secondary-foreground": chosenBackground === bg,
              })}
              style={{
                ...(bg.startsWith("url") // Check if the value is an image URL
                  ? {
                      backgroundImage: bg, // Apply the image as a background
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : { background: bg }), // Otherwise, apply as a color gradient
                borderRadius: "4px",
              }}
            />
          ))}
        </div>

        <SheetFooter className="pt-2 flex">
          <SheetClose asChild>
            <fetcher.Form method="POST" action="/action/update-board">
              <Button type="submit">Save changes</Button>
              <input type="text" hidden readOnly value={id} name="id" />
              <input
                type="text"
                hidden
                readOnly
                value={chosenBackground || ""}
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
