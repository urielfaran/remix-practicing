import { CalendarProps } from "~/components/ui/calendar";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DatePicker } from "./date-picker";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from "react-hook-form";

// Type for basic input excluding the except when it's a checkbox
type ExcludeCheckboxInputType = Omit<React.ComponentProps<"input">, "type"> & {
  type?: Exclude<React.ComponentProps<"input">["type"], "checkbox">;
};

// Props for the DatePicker input, including the calendar props and selected value
type DatePickerProps = {
  calendarProps: CalendarProps;
  value: Date | undefined;
  text?: string | undefined;
};
type DatePickerInputType = { type: "date-picker" } & DatePickerProps;

// Type for Checkbox input props, extending from the Radix Checkbox component
type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;
type CheckBoxInputType = { type: "checkbox" } & Omit<CheckboxProps, "type">;

// Type for select items options with value and text properties
type selectItemsOptionsType = { value: string; text: string };
// Props for the Select input component, including various Radix Select components
type SelectProps = {
  selectProps: React.ComponentProps<typeof SelectPrimitive.Root>;
  selectValueProps: React.ComponentProps<typeof SelectPrimitive.Value>;
  selectContentProps: React.ComponentProps<typeof SelectPrimitive.Content>;
  selectTriggerProps: React.ComponentPropsWithoutRef<
    typeof SelectPrimitive.Trigger
  >;
  selectItemsOptions: selectItemsOptionsType[];
};
type SelectInputType = {
  type: "select";
  value: SelectProps["selectProps"]["value"];
} & SelectProps;

// Base input props that are shared among all input types
type BaseInputProps = { name: string; label: string };

// Type for handling form input control in React Hook Form
export type InputControlProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = ControllerRenderProps<TFieldValues, TName>;

// Form input props that could be one of several input types, the type of the input is discriminated by the common type field
export type FormInputProps = BaseInputProps &
  (
    | ExcludeCheckboxInputType
    | DatePickerInputType
    | CheckBoxInputType
    | SelectInputType
  );

// infers the the type of of the expected value from the input type.
// this is not implemented yet and might be unnecessary because it is only used internally in the form and not 
// in the props so it does not effect the type safety when passing the inputs
export type FormFieldValueType<
  T extends FormInputProps["type"],
  U extends FormInputProps
> = U extends {
  type: T;
}
  ? U["value"]
  : never;

/**
 * `FormInput` is a flexible component that renders different types of form inputs based on the `type` prop. 
 * It supports checkbox, select, date picker, and standard input fields.
 *
 * This component is intended for use in forms where multiple types of inputs are needed. It dynamically renders 
 * the appropriate input field depending on the type provided (`checkbox`, `select`, `date-picker`, or `input`).
 * 
 * @param {FormInputProps} props - The properties for the form input. These properties vary depending on the input type.
 *   - For a `checkbox`, `value` and `onChange` are passed as part of `props`.
 *   - For a `select`, `selectProps`, `selectValueProps`, `selectItemsOptions`, and other `select` related props are required.
 *   - For a `date-picker`, `calendarProps` and `value` are passed.
 *   - For a generic `input`, `type` and other standard input props are used.
 * 
 * @returns {JSX.Element} The rendered form input element, which could be a checkbox, select, date-picker, or input.
 *
 * @example
 * ```tsx
 * <FormInput
 *   type="checkbox"
 *   name="agree"
 *   label="I agree"
 *   value={true}
 *   onChange={handleCheckboxChange}
 * />
 * 
 * <FormInput
 *   type="select"
 *   name="color"
 *   label="Choose a color"
 *   value={selectedColor}
 *   selectItemsOptions={[{ value: "red", text: "Red" }, { value: "blue", text: "Blue" }]}
 *   onChange={handleColorChange}
 * />
 * 
 * <FormInput
 *   type="date-picker"
 *   name="dob"
 *   label="Date of Birth"
 *   value={selectedDate}
 *   onChange={handleDateChange}
 * />
 * ```
 */
function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ type, ...props }: FormInputProps & InputControlProps<TFieldValues, TName>) {
  switch (type) {
    case "checkbox": {
      return (
        <Checkbox
          {...(props as CheckboxProps)}
          checked={props.value}
          onCheckedChange={props.onChange}
        />
      );
    }
    case "select": {
      const {
        selectProps,
        selectValueProps,
        selectContentProps,
        selectTriggerProps,
        selectItemsOptions,
      } = props as SelectProps;
      return (
        <Select
          {...selectProps}
          onValueChange={props.onChange}
          value={String(props.value)}
        >
          <SelectTrigger
            {...selectTriggerProps}
            className={cn("w-[180px]", selectTriggerProps?.className || "")}
          >
            <SelectValue {...selectValueProps} />
          </SelectTrigger>
          <SelectContent {...selectContentProps}>
            {selectItemsOptions.map((option) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.text}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    }
    case "date-picker": {
      return (
        <DatePicker
          {...(props as DatePickerProps)}
          calendarProps={{
            mode: "single",
            selected: props.value,
            onSelect: props.onChange,
          }}
        />
      );
    }
    default:
      return (
        <Input type={type} {...(props as React.ComponentProps<"input">)} />
      );
  }
}

export default FormInput;
