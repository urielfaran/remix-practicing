import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { authenticator } from "~/auth/authenticator";
import {
  LoginForm,
  loginFormFields,
  loginFormResolver,
} from "~/components/forms/LoginForm";
import type { Route } from "./+types/login";
import { ModeToggle } from "~/components/mode-toggle";

export async function loader({ request }: Route.ActionArgs) {
  await authenticator.requireAnonymous(request);
  return null;
}

export default function Login() {
  return (
    <div className="flex min-h-screen w-full p-6 md:p-10 items-center justify-center relative">
    <header className="p-3 absolute left-0 top-0">
      <ModeToggle />
    </header>
    <div className="w-full max-w-sm flex items-center justify-center">
      <LoginForm />
    </div>
  </div>
  
  );
}

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<loginFormFields>(request, loginFormResolver);

  if (errors) return data({ errors, defaultValues }, { status: 400 });

  try {
    const user = await authenticator.authenticateCredentials(
      payload.username,
      payload.password
    );
    return await authenticator.createUserSession(user.id, "/");
  } catch (error) {
    return data(
      { errors: { root: { message: (error as Error).message } } },
      { status: 401 }
    );
  }
}
