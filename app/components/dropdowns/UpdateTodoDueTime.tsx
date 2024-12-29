import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { todoDueTimeSchema } from "~/schemas/todoSchema";
import { Calendar } from "../ui/calendar";

interface UpdateTodoDueTimeProps extends PropsWithChildren {
  todoId: number;
}

function UpdateTodoDueTime({ children, todoId }: UpdateTodoDueTimeProps) {
  const fetcher = useFetcher<ToastProps>();
  const resolver = zodResolver(todoDueTimeSchema);
  useResponseToast(fetcher.data);

  const defaultValues = {
    dueTime: undefined,
    id: todoId,

  };
  const form = useRemixForm<z.infer<typeof todoDueTimeSchema>>({
    resolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: defaultValues,
    submitData: {
      _action: "update-todo-due-time",
      id: todoId,
    },
    fetcher: fetcher,
  });

  const { isSubmitting } = form.formState;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" side="right">
        <ShadForm {...form}>
          <Form
            onSubmit={form.handleSubmit}
            className="flex w-full flex-col space-y-3 p-4"
          >
            <FormField
              control={form.control}
              name="dueTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus={true}
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
      </PopoverContent>
    </Popover>
  );
}

export default UpdateTodoDueTime;
