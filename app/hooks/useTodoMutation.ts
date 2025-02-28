import { useSubmit } from "react-router";
import invariant from "tiny-invariant";
import { INTENTS, ItemMutation } from "~/utils/types";
import { CONTENT_TYPES } from "~/utils/types"; // Assuming it's defined somewhere

export function useTodoMutation(actionUrl: string) {
  const submit = useSubmit();
  
  const moveTodo = ({
    todoId,
    title,
    targetListId,
    order = 1,
  }: {
    todoId: number;
    title: string;
    targetListId: number;
    order?: number;
  }) => {
    invariant(todoId, "missing todoId");
    invariant(title, "missing title");

    const mutation: ItemMutation = {
      order,
      listId: targetListId,
      id: todoId,
      title,
    };

    submit(
      { ...mutation, intent: INTENTS.moveItem },
      {
        method: "post",
        navigate: false,
        fetcherKey: `card:${todoId}`,
        action: actionUrl,
      }
    );
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
      event.preventDefault();
    }
  };

  const handleDrop = (event: React.DragEvent, targetListId: number) => {
    const transfer = JSON.parse(event.dataTransfer.getData(CONTENT_TYPES.card));

    moveTodo({
      todoId: transfer.id,
      title: transfer.title,
      targetListId,
      order: 1,
    });
  };

  return { moveTodo, handleDragOver, handleDrop };
}
