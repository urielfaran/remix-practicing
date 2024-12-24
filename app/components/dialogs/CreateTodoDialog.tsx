import { Todo } from "@prisma/client";
import TodoForm from "../forms/TodoForm";
import { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";

interface CreateTodoDialogProps extends PropsWithChildren {}

type t = Omit<Todo, "id" | "completeTime">;
export type TodoFormType = Record<keyof t, string>;

function CreateTodo({ children }: CreateTodoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogTitle>Create New Todo</DialogTitle>
        <TodoForm action="Create" />
      </DialogContent>
    </Dialog>
  );
}

export default CreateTodo;
