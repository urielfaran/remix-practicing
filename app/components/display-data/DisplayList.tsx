import { Prisma } from "@prisma/client";
import { Permissions, usePermissionStore } from "~/utils/permissions";
import { ListIdContext } from "../../hooks/itemIdContexts";
import AddTodoButton from "../action-buttons/AddTodoButton";
import ListActionDropdown from "../dropdowns/ListActionDropdown";
import EditableText from "../EditableText";
import { Card, CardDescription } from "../ui/card";
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
  
  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );
  return (
    <Card className="w-64 overflow-x-visible bg-secondary h-fit">
      <div className="p-4 pb-0 flex-1 flex flex-row justify-between bg-transparent">
        <>
          <EditableText
            actionName="/action/update-list"
            id={list.id}
            text={list.title}
            fieldName="title"
            isEditable={isEditPermission}
          />
          <ListActionDropdown listId={list.id} isActive={isEditPermission} />
        </>
      </div>
      <CardDescription className="flex flex-col gap-2 overflow-y-auto p-2">
        {list.todos.map((todo, index) => (
          <TodoCard todo={todo} key={index} />
        ))}
      </CardDescription>
      <ListIdContext.Provider value={list.id}>
        <div className="p-1 w-full">
          <AddTodoButton isActive={isEditPermission} />
        </div>
      </ListIdContext.Provider>
    </Card>
  );
}

export default DisplayList;
