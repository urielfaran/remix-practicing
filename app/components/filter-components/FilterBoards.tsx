import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { filterBoardsSchema } from "~/schemas/filterBoards.schema";

function FilterBoards() {
  const defaultValues = {
    query: undefined,
  };

  const resolver = zodResolver(filterBoardsSchema);
  const form = useRemixForm<z.infer<typeof filterBoardsSchema>>({
    resolver,
    submitConfig: {
      method: "GET",
    },
    criteriaMode: "firstError",
    stringifyAllValues: false,
    defaultValues: defaultValues,
  });

  return (
    <ShadForm {...form}>
      <Form
        method="get"
        onSubmit={form.handleSubmit}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <Input
                {...field}
                value={field.value ? field.value.toString() : ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.handleSubmit();
                }}
                placeholder="search..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </ShadForm>
  );
}

export default FilterBoards;
