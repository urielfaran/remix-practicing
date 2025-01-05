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
import { createBoardSchema, updateBoardSchema } from "~/schemas/board.schema";
import { FormActions } from "./TodoForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { backgrounds, colors } from "~/utils/backgrounds";
import { ScrollArea } from "../ui/scroll-area";
import { useContext } from "react";
import { UserIdContext } from "~/hooks/itemIdContexts";

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

  const userId = useContext(UserIdContext)

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
      userId: userId
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
              <FormLabel>{"Background Color"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger
                    style={{
                      background: field.value || "transparent", // Display background or transparent
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
                  <ScrollArea>
                    <div className="grid grid-cols-2 gap-2">
                      {backgrounds.map((bg, index) => (
                        <SelectItem
                          key={index}
                          value={bg}
                          className="min-h-16"
                          style={{
                            ...(bg.startsWith("url") // Check if the value is an image URL
                              ? {
                                  backgroundImage: bg, // Apply the image as a background
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }
                              : { background: bg }), // Otherwise, apply as a color gradient
                            borderRadius: "4px",
                          }}
                        >
                        </SelectItem>
                      ))}
                    </div>
                  </ScrollArea>
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
