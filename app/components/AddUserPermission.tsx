import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Form, useFetcher } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import useResponseToast from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import {
  addPermissionsSchema,
  permissionsArray,
} from "~/schemas/shareBoard.schema";
import { UserWithBoardRelation } from "./BoardHeader";
import { UsersCombobox } from "./UsersCombobox";

interface AddUserPermissionProps {
  usersWithoutBoardRelation: UserWithBoardRelation[];
  boardId: number;
}

export const adddPermissionsResolver = zodResolver(addPermissionsSchema);
export type adddPermissionsSchemaType = z.infer<typeof addPermissionsSchema>;

export function AddUserPermission({
  usersWithoutBoardRelation,
  boardId,
}: AddUserPermissionProps) {
  const fetcher = useFetcher();
  useResponseToast(fetcher.data);

  const defaultValues = {
    permission: undefined,
    userId: undefined,
  };

  const form = useRemixForm<adddPermissionsSchemaType>({
    resolver: adddPermissionsResolver,
    submitConfig: {
      method: "POST",
    },
    submitData: {
      boardId: boardId,
    },
    fetcher: fetcher,
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  return (
    <>
      <ShadForm {...form}>
        <Form
          onSubmit={form.handleSubmit}
          className="flex flex-col gap-5"
          action="/action/share-board"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <UsersCombobox
                  form={form}
                  usersWithoutBoardRelation={usersWithoutBoardRelation}
                  value={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Choose Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {permissionsArray.map(({ key, value }, index) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={index}
                      >
                        <FormControl>
                          <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{key}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="default"
            className="m-1 w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                Loading...
                <span>
                  <Loader2Icon className="animate-spin" />
                </span>
              </span>
            ) : (
              "Share Board"
            )}
          </Button>
        </Form>
      </ShadForm>
    </>
  );
}
