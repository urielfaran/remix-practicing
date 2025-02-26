import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@prisma/client";
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
import { Input } from "~/components/ui/input";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import { baseLabelSchema } from "~/schemas/label.schema";
import { labelColors } from "~/utils/labels";
import { Badge } from "../ui/badge";

interface AddLabelFormProps {
  todoId: number;
  label?: Label;
}

export type baseLabelSchemaType = z.infer<typeof baseLabelSchema>;
export const baseLabelReslover = zodResolver(baseLabelSchema);

function LabelForm({ todoId, label }: AddLabelFormProps) {
  const fetcher = useFetcher<ToastProps>();

  useResponseToast(fetcher.data);

  const defaultValues = {
    todoId: todoId,
    backgroundColor: label?.backgroundColor ?? "",
    text: label?.text ?? "",
  };

  const form = useRemixForm<baseLabelSchemaType>({
    resolver: baseLabelReslover,
    submitConfig: {
      method: "POST",
    },
    defaultValues: defaultValues,
    submitData: {
      todoId: todoId,
      labelId: label?.id ?? null,
    },
    fetcher: fetcher,
  });

  const { isSubmitting } = form.formState;
  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
        action= {label ? "/action/update-label":  "/action/add-label"}
      >
        <FormField
          control={form.control}
          name="backgroundColor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="grid grid-cols-2 gap-4 p-1 max-h-40 overflow-y-auto">
                {labelColors.map((bg, index) => (
                  <Badge
                    onClick={() => form.setValue("backgroundColor", bg)}
                    key={index}
                    style={{ backgroundColor: bg }}
                    className={cn("min-h-8", {
                      "ring-4 ring-secondary-foreground": field.value === bg,
                    })}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Input {...field} />
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
         {label ?  "Edit Label" : "Add Label"}
        </Button>
      </Form>
    </ShadForm>
  );
}

export default LabelForm;
