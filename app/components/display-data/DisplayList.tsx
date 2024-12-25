import { Prisma } from "@prisma/client";
import { ListIdContext } from "../../hooks/itemIdContexts";
import AddTodoButton from "../action-buttons/AddTodoButton";
import ListActionDropdown from "../dropdowns/ListActionDropdown";
import { Card, CardDescription } from "../ui/card";
import UpdateListInput from "../UpdateListInput";
import TodoCard from "./DisplayTodo";

export type ListWithTodos = Prisma.ListGetPayload<{
  include: {
    todos: true;
  };
}>;

interface DisplayListProps {
  list: ListWithTodos;
}
function DisplayList({ list }: DisplayListProps) {
  return (
    <Card className="min-w-64 bg-secondary h-fit">
      <div className="p-2 flex flex-row justify-center bg-transparent">
        <UpdateListInput list={list} />
        <ListActionDropdown listId={list.id} />
      </div>
      <CardDescription className="flex flex-col gap-2 overflow-y-auto">
        {list.todos.map((todo, index) => (
          <TodoCard todo={todo} key={index} />
        ))}
      </CardDescription>
      <ListIdContext.Provider value={list.id}>
        <div className="p-1 w-full">
          <AddTodoButton />
        </div>
      </ListIdContext.Provider>
    </Card>
  );
}

export default DisplayList;
