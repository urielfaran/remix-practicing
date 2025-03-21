import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LabelForm from "../forms/LabelForm";
import { Label } from "@prisma/client";
import { Button } from "../ui/button";
import { Form, useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { dialogStyleType } from "./EditTodoDialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

interface EditLabelDialogProps extends PropsWithChildren {
  todoId: number;
  label: Label;
  dialogStyle: dialogStyleType;
}

function EditLabelDialog({
  children,
  label,
  todoId,
  dialogStyle,
}: EditLabelDialogProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
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
          <LabelForm todoId={todoId} label={label} />
          <fetcher.Form action={`/action/delete-label`} method="post">
            <input type="text" hidden readOnly value={label.id} name="id" />
            <Button variant={"destructive"} className="w-full" type="submit">
              Delte Label
            </Button>
          </fetcher.Form>
          <DialogPrimitive.Close className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export default EditLabelDialog;
