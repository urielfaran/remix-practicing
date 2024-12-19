import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { Delete, Filter, Search } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { filterTodosSchema } from "~/schemas/filterTodos.schema";
import FilterPopover from "./FilterPopover";
import { Button } from "./ui/button";
import {
  FormField,
  FormItem,
  FormMessage,
  Form as ShadForm
} from "./ui/form";
import { Input } from "./ui/input";

function FilterTodos() {

  const defaultValues = {
    startDate: undefined,
    endDate: undefined,
    query: undefined,
  };

  const resolver = zodResolver(filterTodosSchema);
  const form = useRemixForm<z.infer<typeof filterTodosSchema>>({
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
        <div className="flex items-center space-x-2">
          <FilterPopover form={form} >
            <Button variant={"ghost"}>
              <Filter />
            </Button>
          </FilterPopover>
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <Input
                  {...field}
                  className="w-full"
                  value={field.value ? field.value.toString() : ""}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row space-x-4">
          <Button className="w-full" type="submit">
            Search
            <Search />
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              form.reset(defaultValues);
            }}
            type="reset"
            variant="outline"
          >
            Clear
            <Delete />
          </Button>
        </div>
      </Form>
    </ShadForm>
  );
}

export default FilterTodos;
