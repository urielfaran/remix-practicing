import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar, CalendarProps } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  calendarProps: CalendarProps;
  value: Date | undefined;
  text?: string | undefined;
}
/**
 * `DatePicker` is a component that displays a button for selecting a date.
 * When the button is clicked, a popover calendar appears, allowing the user
 * to choose a date. The selected date is formatted and shown in the button.
 *
 * @param {DatePickerProps} props - The properties passed to the component calendar component and the value of the datePicker input.
 *
 * @returns {JSX.Element} The rendered `DatePicker` component.
 */
export function DatePicker({ calendarProps, value, text }: DatePickerProps) {
  const textToDisplay = text ?? "choose_date";
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy") : <span>{textToDisplay}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
