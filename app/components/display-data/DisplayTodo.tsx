import { Todo } from "@prisma/client";
import { differenceInDays, format } from "date-fns";
import { Calendar, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import UncompleteTodoButton from "../action-buttons/UncompleteTodoButton";
import EditTodoDialog, { dialogStyleType } from "../dialogs/EditTodoDialog";
import TodoActionDropdown from "../dropdowns/TodoActionDropdown";
import UpdateTodoDueTime from "../dropdowns/UpdateTodoDueTime";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface DisplayTodoProps {
  todo: Todo;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  dialogStyle: dialogStyleType;
}

function TodoDisplay({
  todo,
  isEditing,
  setIsEditing,
  dialogStyle,
}: DisplayTodoProps) {
  const isLate = differenceInDays(todo.dueTime, new Date()) < 0;

  return (
    <>
      <div className="flex flex-row justify-between items-center group relative z-10">
        <CardTitle className="flex-1 outline-none">{todo.title}</CardTitle>
        <EditTodoDialog todo={todo} dialogStyle={dialogStyle}>
          <Button
            size={"sm"}
            variant={"ghost"}
            className="invisible group-hover:visible"
          >
            <Pencil />
          </Button>
        </EditTodoDialog>
        {!todo.completeTime && (
          <TodoActionDropdown
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            todoId={todo.id}
          />
        )}
      </div>
      <CardDescription className="space-y-3">
        <p>{todo.description}</p>
        <div className="flex justify-between items-center">
          {todo.completeTime && <UncompleteTodoButton todo={todo} />}
          <div className="flex-1 flex justify-end">
            <UpdateTodoDueTime todoId={todo.id}>
              <Button
                variant={isLate ? "destructive" : "ghost"}
                className={cn("", {
                  "bg-green-600 hover:bg-green-700 text-white":
                    todo.completeTime,
                })}
                size={"sm"}
              >
                <Calendar />
                {format(todo.dueTime, "MMM d, yyyy")}
              </Button>
            </UpdateTodoDueTime>
          </div>
        </div>
      </CardDescription>
    </>
  );
}

function TodoCard({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [dialogStyle, setDialogStyle] = useState({
    top: 0,
    left: 0,
    width: "auto",
  });

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDialogStyle({
        top: rect.top + window.scrollY, // Position below the card
        left: rect.left,
        width: `${rect.width}px`, // Match the card's width
      });
    }
  }, [cardRef.current]);

  return (
    <Card
      key={todo.id}
      ref={cardRef}
      className={cn("relative grid min-w-48 p-2 hover:ring-2")}
    >
      <TodoDisplay
        todo={todo}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        dialogStyle={dialogStyle}
      />
    </Card>
  );
}

export default TodoCard;
