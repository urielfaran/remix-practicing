import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "@prisma/client";
import { Form, useFetcher } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { createListSchema, updateListSchema } from "~/schemas/listSchema";
import { FormActions } from "./TodoForm";
import { Button } from "~/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form as ShadForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface TodoFormProps {
  list?: Todo;
  action: keyof typeof FormActions;
}

function ListForm({ action, list }: TodoFormProps) {
  const fetcher = useFetcher<ToastProps>();
  const schema = list ? updateListSchema : createListSchema;
  const resolver = zodResolver(schema);
  useResponseToast(fetcher.data);

  const defaultValues = {
    title: undefined,
  };
  
  const form = useRemixForm<z.infer<typeof schema>>({
    resolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: list ?? defaultValues,
    submitData: {
      _action: list ? "update-list" : "create-list",
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
                // value={field.value}
                placeholder={"title"}
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
              {action === "Create" ? "creating list..." : "updating list..."}{" "}
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

export default ListForm;
