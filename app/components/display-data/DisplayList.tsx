import { Prisma } from "@prisma/client";
import { useRef, useState } from "react";
import { usePermissionStore, Permissions } from "~/utils/permissions";
import { useTodoMutation } from "~/hooks/useTodoMutation";
import { Card } from "../ui/card";
import EditableText from "../EditableText";
import ListActionDropdown from "../dropdowns/ListActionDropdown";
import TodoCard from "./DisplayTodo";
import { ListIdContext } from "../../hooks/itemIdContexts";
import AddTodoButton from "../action-buttons/AddTodoButton";
import invariant from "tiny-invariant";

export type ListWithTodos = Prisma.ListGetPayload<{
  include: {
    todos: {
      include: {
        labels: true;
      };
    };
  };
}>;

interface DisplayListProps {
  list: ListWithTodos;
}

function DisplayList({ list }: DisplayListProps) {
  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );

  const listRef = useRef<HTMLUListElement>(null);
  const { handleDragOver, handleDrop } = useTodoMutation(
    `/action/change-todo-list`
  );

  return (
    <Card
      className={"min-w-64 bg-primary-foreground h-fit"}
      onDragOver={handleDragOver}
      onDrop={(event) => {
        handleDrop(event, list.id);
      }}
    >
      <div className="p-4 pb-0 flex-1 flex flex-row justify-between bg-transparent">
        <EditableText
          actionName="/action/update-list"
          id={list.id}
          text={list.title}
          fieldName="title"
          isEditable={isEditPermission}
        />
        <ListActionDropdown listId={list.id} isActive={isEditPermission} />
      </div>
      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {list.todos
          .sort((a, b) => a.order - b.order)
          .map((todo, index) => (
            <TodoCard
              todo={todo}
              key={index}
              todos={list.todos}
              index={index}
            />
          ))}
      </ul>
      <ListIdContext.Provider value={list.id}>
        <div className="p-1 w-full">
          <AddTodoButton isActive={isEditPermission} />
        </div>
      </ListIdContext.Provider>
    </Card>
  );
}

export default DisplayList;
