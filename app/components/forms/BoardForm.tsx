import { zodResolver } from "@hookform/resolvers/zod";
import { Board } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { createBoardSchema, updateBoardSchema } from "~/schemas/boardSchema";
import { FormActions } from "./TodoForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BoardFormProps {
  board?: Board;
  action: keyof typeof FormActions;
}

export type createBoardSchemaType = z.infer<typeof createBoardSchema>;
export const createBoardResolver = zodResolver(createBoardSchema);
export type updateBoardSchemaType = z.infer<typeof updateBoardSchema>;
export const updateBoardResolver = zodResolver(updateBoardSchema);

function BoardForm({ action, board }: BoardFormProps) {
  const fetcher = useFetcher<ToastProps>();
  const schema = board ? updateBoardSchema : createBoardSchema;
  const resolver = zodResolver(schema);
  useResponseToast(fetcher.data);

  const defaultValues = {
    name: undefined,
    backgroundColor: undefined,
  };

  const form = useRemixForm<z.infer<typeof schema>>({
    resolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: board ?? defaultValues,
    submitData: {
      _action: board ? "update-board" : "create-board",
    },
    fetcher: fetcher,
  });

  const colors = [
    {
      value: "gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      text: "red",
    },
    {
      value: "gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%",
      text: "red",
    },
  ];

  const { isSubmitting } = form.formState;
  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"name"}</FormLabel>
              <Input
                {...field}
                className="flex-grow"
                value={field.value ?? ""}
                placeholder={"name"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backgroundColor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"backgroundColor"}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Your Board Color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color, index) => (
                    <SelectItem
                      key={index}
                      value={color.value}
                      className={`bg-${color.value} flex items-center justify-center min-h-10 m-2`}
                    >
                      <span className="text-white"></span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default BoardForm;
