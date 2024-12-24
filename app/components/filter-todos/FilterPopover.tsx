import { PropsWithChildren } from "react";
import { DatePicker } from "~/components/ui/date-picker";
import { FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface FilterPopoverProps extends PropsWithChildren {
  form: any
}
function FilterPopover({ children, form }: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="left" className="flex flex-col gap-3">
        <h3 className="text-center font-bold">Filter Your Todos</h3>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"Start Date"}</FormLabel>
              <DatePicker
                value={field.value}
                calendarProps={{
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  defaultMonth: field.value,
                  disabled: (date) =>
                    date < new Date("1900-01-01") ||
                    date >
                      (form.getValues()["endDate"] ?? new Date("2100-01-01")),
                  initialFocus: true,
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"End Date"}</FormLabel>
              <DatePicker
                value={field.value}
                calendarProps={{
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  defaultMonth: form.getValues()["startDate"],
                  disabled: (date) =>
                    date < (form.getValues()["startDate"] ?? new Date()),
                  initialFocus: true,
                }}
              />
            </FormItem>
          )}
        />
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopover;
