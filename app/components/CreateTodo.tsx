import { Todo } from "@prisma/client";
import TodoForm from "./TodoForm";

type t = Omit<Todo, "id" | "isCompleted">;
export type TodoFormType = Record<keyof t, string>;

function CreateTodo() {
  return <TodoForm action={"Create"} />;
}

export default CreateTodo;
