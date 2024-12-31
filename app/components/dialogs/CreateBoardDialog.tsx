import { PropsWithChildren } from "react";
import BoardForm from "../forms/BoardForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CreateListDialogProps extends PropsWithChildren {}

function CreateBoardDialog({ children }: CreateListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogTitle>Create New Board</DialogTitle>
        <BoardForm action="Create" />
      </DialogContent>
    </Dialog>
  );
}

export default CreateBoardDialog;
