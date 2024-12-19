import { Prisma } from "@prisma/client";
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
    <div>
      <h2 className="bg-muted-foreground">{list.title}</h2>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {list.todos.map((todo, index) => (
          <TodoCard todo={todo} key={index} />
        ))}
      </div>
    </div>
  );
}

export default DisplayList;
