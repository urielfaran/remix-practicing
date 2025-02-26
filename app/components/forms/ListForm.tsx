import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@prisma/client";
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
import { Input } from "~/components/ui/input";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { createListSchema, updateListSchema } from "~/schemas/list.schema";
import { useBoardStore } from "~/utils/board-store";
import { FormActions } from "./TodoForm";

interface ListFormProps {
  list?: List;
  action: keyof typeof FormActions;
}

export type createListSchemaType = z.infer<typeof createListSchema>;
export const createListResolver = zodResolver(createListSchema);

export type updateListSchemaType = z.infer<typeof updateListSchema>;
export const updateListResolver = zodResolver(updateListSchema);

function ListForm({ action, list }: ListFormProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  const board = useBoardStore((state) => state.board);
  if (!board) return null;
  const { id } = board;

  const schema = list ? updateListSchema : createListSchema;

  const defaultValues = {
    title: undefined,
    boardId: id,
  };

  const form = useRemixForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    submitConfig: {
      method: "POST",
    },
    defaultValues: list ?? defaultValues,
    submitData: {
      _action: list ? "update-list" : "create-list",
      boardId: id,
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
