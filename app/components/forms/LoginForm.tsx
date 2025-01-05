import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-router";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { userBaseSchema } from "~/schemas/user.schema";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

export type loginFormFields = z.infer<typeof userBaseSchema>;
export const loginFormResolver = zodResolver(userBaseSchema);

export function LoginForm() {
  const defaultValues = {
    username: "",
    password: "",
  };

  const form = useRemixForm<loginFormFields>({
    resolver: loginFormResolver,
    submitConfig: {
      method: "POST",
    },
    defaultValues: defaultValues,
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <ShadForm {...form}>
      <Form
        className="flex h-full flex-col justify-center gap-4"
        onSubmit={form.handleSubmit}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your user credentials below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name={"username"}
              render={({ field }) => (
                <FormItem id={field.name} className="flex flex-col">
                  <FormLabel>{"username"}</FormLabel>
                  <Input
                    {...field}
                    onChange={field.onChange}
                    className="flex-grow"
                    value={field.value ? field.value.toString() : ""}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem id={field.name} className="flex flex-col">
                  <FormLabel>{"password"}</FormLabel>
                  <Input
                    {...field}
                    onChange={field.onChange}
                    className="flex-grow"
                    type="password"
                    value={field.value ? field.value.toString() : ""}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="mt-2 text-xs text-red-500">
              {errors.root?.message ?? null}
            </p>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  {"loging in..."}{" "}
                  <span>
                    <Loader2Icon className="animate-spin" />
                  </span>
                </span>
              ) : (
                "log in"
              )}
            </Button>
          </CardContent>
        </Card>
      </Form>
    </ShadForm>
  );
}
