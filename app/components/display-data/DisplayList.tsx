import { Prisma } from "@prisma/client";
import { ListIdContext } from "../../hooks/itemIdContexts";
import AddTodoButton from "../action-buttons/AddTodoButton";
import ListActionDropdown from "../dropdowns/ListActionDropdown";
import EditableText from "../EditableText";
import { Card, CardDescription } from "../ui/card";
import TodoCard from "./DisplayTodo";
import { hasPermission, Permissions } from "~/utils/permissions";

export type ListWithTodos = Prisma.ListGetPayload<{
  include: {
    todos: true;
  };
}>;

interface DisplayListProps {
  list: ListWithTodos;
  permissions: number;
}

function DisplayList({ list, permissions }: DisplayListProps) {
  // const isDeletePermission = hasPermission(permissions, Permissions.DELETE);
  const isEditPermission = hasPermission(permissions, Permissions.WRITE);

  return (
    <Card className="min-w-64 bg-secondary h-fit">
      <div className="p-4 pb-0 flex-1 flex flex-row justify-between bg-transparent">
        {isEditPermission ? (
          <>
            <EditableText
              actionName="/action/update-list"
              id={list.id}
              text={list.title}
              fieldName="title"
            />
            <ListActionDropdown listId={list.id} />
          </>
        ) : (
          list.title
        )}
      </div>
      <CardDescription className="flex flex-col gap-2 overflow-y-auto p-2">
        {list.todos.map((todo, index) => (
          <TodoCard todo={todo} key={index} permissions={permissions} />
        ))}
      </CardDescription>
      {isEditPermission && (
        <ListIdContext.Provider value={list.id}>
          <div className="p-1 w-full">
            <AddTodoButton />
          </div>
        </ListIdContext.Provider>
      )}
    </Card>
  );
}

export default DisplayList;
