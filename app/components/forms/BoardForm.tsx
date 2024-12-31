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
    "linear-gradient(#e66465, #9198e5)",
    "linear-gradient(to right, #8360c3, #2ebf91)",
    "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)",
    "linear-gradient(to right, #f12711, #f5af19)",
    "linear-gradient(to right, #fc5c7d, #6a82fb)",
    "linear-gradient(to right, #03001e, #7303c0, #ec38bc, #fdeff9)",
    "linear-gradient(to right, #ee0979, #ff6a00)",
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
              <FormLabel>{"background color"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger
                    style={{
                      background: field.value || "transparent",
                    }}
                    className={`border rounded-md ${
                      field.value
                        ? "text-white border-transparent"
                        : "border-gray-300 text-inherit"
                    }`}
                  >
                    <SelectValue placeholder="Select Your Board Color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map((color, index) => (
                      <SelectItem
                        key={index}
                        value={color}
                        className="min-h-10"
                        style={{
                          background: color.startsWith("linear-gradient")
                            ? color
                            : color,
                          borderRadius: "4px", // Optional: Make the dropdown items rounded
                        }}
                      >
                        <span className="text-white"></span>
                      </SelectItem>
                    ))}
                  </div>
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
              {action === "Create" ? "creating board..." : "updating board..."}{" "}
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
