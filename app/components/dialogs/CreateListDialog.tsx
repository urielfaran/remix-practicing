import { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import ListForm from "../forms/ListForm";

interface CreateListDialogProps extends PropsWithChildren {}

function CreateListDialog({ children }: CreateListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogTitle>Create New List</DialogTitle>
        <ListForm action="Create" />
      </DialogContent>
    </Dialog>
  );
}

export default CreateListDialog;
