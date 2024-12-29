import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { todoContentSchema } from "~/schemas/todoSchema";
import { Input } from "../ui/input";
import { Todo } from "@prisma/client";

interface UpdateTodoDueTimeProps {
  todo: Todo;
}

function UpdateTodoContent({ todo }: UpdateTodoDueTimeProps) {
  const fetcher = useFetcher<ToastProps>();
  const resolver = zodResolver(todoContentSchema);
  useResponseToast(fetcher.data);

  const form = useRemixForm<z.infer<typeof todoContentSchema>>({
    resolver,
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
          variant="default"
          className="m-1 w-full"
          type="submit"
          name="_action"
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
            "Update"
          )}
        </Button>
      </Form>
    </ShadForm>
  );
}

export default UpdateTodoContent;
