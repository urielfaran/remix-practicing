import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "@prisma/client";
import { Form, useFetcher } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { createTodoSchema } from "~/schemas/todo.schema";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ListIdContext } from "~/hooks/itemIdContexts";
import { useContext } from "react";

export enum FormActions {
  Create,
  Update,
}

interface TodoFormProps {
  todo?: Todo;
  action: keyof typeof FormActions;
}

export type createTodoSchemaType = z.infer<typeof createTodoSchema>;
export const createTodoResolver = zodResolver(createTodoSchema);

function TodoForm({ action, todo }: TodoFormProps) {
  const fetcher = useFetcher<ToastProps>();
  // const schema = todo ? updateTodoSchema : createTodoSchema;

  useResponseToast(fetcher.data);

  const listId = useContext(ListIdContext);

  const defaultValues = {
    title: undefined,
    description: "",
    dueTime: undefined,
    listId: listId,
  };

  const form = useRemixForm<createTodoSchemaType>({
    resolver: createTodoResolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: todo ?? defaultValues,
    submitData: {
      _action: todo ? "update-todo" : "create-todo",
      listId: listId,
    },
    fetcher: fetcher,
  });

  const { isSubmitting } = form.formState;
  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"title"}</FormLabel>
              <Input
                {...field}
                className="flex-grow"
                value={field.value ?? ""}
                placeholder={"title"}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"description"}</FormLabel>
              <Input
                {...field}
                className="flex-grow"
                value={field.value ?? ""}
                placeholder={"description"}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"End Date"}</FormLabel>
              <DatePicker
                value={field.value}
                calendarProps={{
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  initialFocus: true,
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="default"
          className="m-1 w-full"
          type="submit"
          name="_action"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {action === "Create" ? "creating todo..." : "updating todo..."}{" "}
              <span>
                <Loader2Icon className="animate-spin" />
              </span>
            </span>
          ) : action === "Create" ? (
            "Add"
          ) : (
            "Update"
          )}
        </Button>
        {action === "Create" ? (
          <Button
            variant={"outline"}
            className="m-1 w-full"
            type="reset"
            onClick={() => {
              form.reset();
            }}
          >
            reset
          </Button>
        ) : null}
      </Form>
    </ShadForm>
  );
}

export default TodoForm;
