import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import {
  userCredentialsResolver,
  userCredentialsSchemaType,
} from "~/components/forms/UserCredentialsForm";
import { updateUserCredentials } from "~/utils/user.server";
import { Route } from "./+types/update-user-credentials";

export async function action({ request }: Route.ActionArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<userCredentialsSchemaType>(
    request,
    userCredentialsResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }
  try {
    await updateUserCredentials({
      ...payload,
      userId: Number(userId),
    });
  } catch (err) {
    return data(
      {
        err,
        payload,
        toastTitle: "User Updation Has Been Failed",
        toastContent: "Could not update user!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "User Has Been Updated",
    toastContent: "User has been updated successfully!",
  });
}
