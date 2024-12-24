import { Prisma } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { ListIdContext } from "../../hooks/listIdContext";
import AddTodoButton from "../action-buttons/AddTodoButton";
import DeleteButton from "../action-buttons/DeleteButton";
import GenericActionDropdown from "../dropdowns/GenericActionDropdown";
import { Button } from "../ui/button";
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
  const listActions = [
    <DeleteButton id={list.id} action='"delete-list"' text="Delete List" />,
  ];

  return (
    <Card className="min-w-64 bg-secondary h-fit">
      <div className="p-2 flex flex-row justify-center bg-transparent">
        <UpdateListInput list={list} />
        {/* <ListActionDropdown listId={list.id}>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </ListActionDropdown> */}
        <GenericActionDropdown actions={listActions} label="List Actions">
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </GenericActionDropdown>
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
