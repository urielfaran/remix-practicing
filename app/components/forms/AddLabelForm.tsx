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
import { baseLabelSchema } from "~/schemas/label.schema";
import { labelColors } from "~/utils/labels";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";

interface AddLabelFormProps {
  todoId: number;
}

export type baseLabelSchemaType = z.infer<typeof baseLabelSchema>;
export const baseLabelReslover = zodResolver(baseLabelSchema);

function AddLabelForm({ todoId }: AddLabelFormProps) {
  const fetcher = useFetcher<ToastProps>();

  useResponseToast(fetcher.data);

  const defaultValues = {
    todoId: todoId,
    backgroundColor: "",
  };

  const form = useRemixForm<baseLabelSchemaType>({
    resolver: baseLabelReslover,
    submitConfig: {
      method: "POST",
    },
    defaultValues: defaultValues,
    submitData: {
      todoId: todoId,
    },
    fetcher: fetcher,
  });

  const { isSubmitting } = form.formState;
  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
        action="/action/add-label"
      >
        <FormField
          control={form.control}
          name="backgroundColor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="grid grid-cols-2 gap-4 p-1">
                {labelColors.map((bg, index) => (
                  <Badge
                    onClick={() => form.setValue("backgroundColor", bg)}
                    key={index}
                    style={{ backgroundColor: bg }}
                    className={cn("min-h-10", {
                      "ring-4 ring-secondary-foreground": field.value === bg,
                    })}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="outline"
          className="m-1 w-full"
          type="submit"
          disabled={isSubmitting}
        >
          Add Label
        </Button>
      </Form>
    </ShadForm>
  );
}

export default AddLabelForm;
