import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "@prisma/client";
import { Loader2Icon, Save } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm
} from "~/components/ui/form";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { todoContentSchema } from "~/schemas/todoSchema";
import { Input } from "../ui/input";

interface UpdateTodoDueTimeProps {
  todo: Todo;
}

export type updateTodoContentSchemaType = z.infer<typeof todoContentSchema>;
export const updateTodoContentResolver = zodResolver(todoContentSchema)

function UpdateTodoContent({ todo }: UpdateTodoDueTimeProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  const form = useRemixForm<updateTodoContentSchemaType>({
    resolver: updateTodoContentResolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: todo,
    submitData: {
      _action: "update-todo-content",
      id: todo.id,
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
              <Input {...field} className="flex-grow" placeholder={"title"} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
        <Button
          // className="m-1 w-full"
          type="submit"
          name="_action"
          size={'sm'}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {"updating todo..."}{" "}
              <span>
                <Loader2Icon className="animate-spin" />
              </span>
            </span>
          ) : (
            "Save"
          )}
          <Save/>
        </Button>
      </Form>
    </ShadForm>
  );
}

export default UpdateTodoContent;
