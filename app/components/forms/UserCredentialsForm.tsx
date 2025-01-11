import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
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
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { userCredentialsSchema } from "~/schemas/user.schema";
import { Input } from "../ui/input";

interface UserCredentialsFormProps {
  user: User;
}

export type userCredentialsSchemaType = z.infer<typeof userCredentialsSchema>;
export const userCredentialsResolver = zodResolver(userCredentialsSchema);

function UserCredentialsForm({ user }: UserCredentialsFormProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  const defaultValues = {
    email: undefined,
    avatar: "",
  };

  const form = useRemixForm<userCredentialsSchemaType>({
    resolver: userCredentialsResolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: defaultValues,
    fetcher: fetcher,
  });

  const { isSubmitting } = form.formState;

  const fileRef = form.register("avatar");

  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
        action="/action/update-user-credentials"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"email"}</FormLabel>
              <Input
                {...field}
                className="flex-grow"
                value={field.value ?? ""}
                placeholder={"email"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"avatar"}</FormLabel>
              <FormControl>
                <Input type="file" placeholder="shadcn" {...fileRef} />
              </FormControl>
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
              {"updating user..."}
              <span>
                <Loader2Icon className="animate-spin" />
              </span>
            </span>
          ) : (
            "Save changes"
          )}
        </Button>
      </Form>
    </ShadForm>
  );
}

export default UserCredentialsForm;
