import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar, CalendarProps } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';

interface DatePickerProps {
  calendarProps: CalendarProps;
  value: Date | undefined;
  text?: string | undefined;
}

export function DatePicker({ calendarProps, value, text }: DatePickerProps) {
  const textToDIsplay = text ?? "choose date";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {value ? (
            format(value, 'dd/MM/yyyy')
          ) : (
            <span>{(textToDIsplay)}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
