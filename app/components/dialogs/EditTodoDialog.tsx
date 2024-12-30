import { Todo } from "@prisma/client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import UpdateTodoContent from "../dropdowns/UpdateTodoContent";
import {
    Dialog,
    DialogOverlay,
    DialogPortal,
    DialogTrigger,
} from "../ui/dialog";

export type dialogStyleType = {
  top: number;
  left: number;
  width: string;
};

interface EditTodoDialogProps extends PropsWithChildren {
  todo: Todo;
  dialogStyle: dialogStyleType;
}

function EditTodoDialog({ dialogStyle, todo, children }: EditTodoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 grid w-full max-w-lg bg-muted p-3 shadow-lg data-[state=open]:opacity-1 data-[state=closed]:opacity-0 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          )}
          style={{
            top: `${dialogStyle.top}px`,
            left: `${dialogStyle.left}px`,
            width: dialogStyle.width,
          }}
        >
          <DialogPrimitive.DialogTitle></DialogPrimitive.DialogTitle>
          <UpdateTodoContent todo={todo} />

          <DialogPrimitive.Close className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export default EditTodoDialog;
