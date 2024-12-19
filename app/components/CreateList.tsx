import { PropsWithChildren } from "react";
import ListForm from "./ListForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface CreateListProps extends PropsWithChildren {}

function CreateList({ children }: CreateListProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <ListForm action="Create" />
      </DialogContent>
    </Dialog>
  );
}

export default CreateList;
