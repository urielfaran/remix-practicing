import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { FullBoard } from "~/routes/board";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export function getAllBoardTodos(board: FullBoard) {
  return board.lists.flatMap((list) => list.todos);
}

interface TodoCalendarProps {
  board: FullBoard;
}

function TodoCalendar({ board }: TodoCalendarProps) {
  const allTodos = getAllBoardTodos(board);
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => {
    return allTodos.filter(
      (task) =>
        task.dueTime &&
        task.dueTime.getDate() === date.getDate() &&
        task.dueTime.getMonth() === date.getMonth() &&
        task.dueTime.getFullYear() === date.getFullYear()
    );
  };

  const renderDay = (
    day: Date,
    selectedDate: Date | undefined,
    activeModifiers: any
  ) => {
    const dayTasks = getTasksForDate(day);
    const isSelected =
      selectedDate && day.toDateString() === selectedDate.toDateString();
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative flex h-full w-full flex-col items-center justify-start p-1">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                isSelected && "bg-blue-100 text-blue-800 ring-2 ring-blue-500",
                activeModifiers.today && "border-2 border-purple-500",
                !isSelected && !activeModifiers.today && "hover:bg-gray-100"
              )}
            >
              {day.getDate()}
            </span>
            <div className="mt-2 flex flex-col space-y-2 text-xs overflow-auto">
              {dayTasks.length > 0 && (
                <div className="rounded-md shadow-sm overflow-hidden p-2">
                  <p className="font-medium">{dayTasks[0]?.title}</p>
                  {dayTasks.length > 1 && (
                    <p className="text-sm">and {dayTasks.length - 1} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>titel</DialogTitle>
          test
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-lg">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(e) => setDate(e || new Date())}
        month={month}
        onMonthChange={setMonth}
        className="w-full rounded-md border bg-muted"
        components={{
          DayContent: (props) =>
            renderDay(props.date, date, props.activeModifiers),
        }}
        classNames={{
          months: "w-full",
          month: "w-full space-y-6",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-between mb-4",
          head_cell:
            "text-gray-600 w-full text-center font-semibold text-sm uppercase tracking-wide",
          row: "flex w-full mt-2",
          cell: "h-[100px] w-full p-1 overflow-hidden relative",
          day: "h-full w-full",
          day_selected:
            "bg-inherit border-2 border-primary rounded overflow-hidden",
        }}
      />
    </div>
  );
}

export default TodoCalendar;
