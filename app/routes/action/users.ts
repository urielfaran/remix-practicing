import { authenticator } from "~/auth/authenticator";
import { Route } from "./+types/users";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData } from "remix-hook-form";
import { getUsersSchema, usersStatusOptions } from "~/schemas/user.schema";
import { data } from "react-router";
import { getUsers } from "~/utils/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<z.infer<typeof getUsersSchema>>(
    request,
    zodResolver(getUsersSchema)
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 0);
  const boardId = Number(url.searchParams.get("boardId") || 0);
  const usersStatus = url.searchParams.get("usersStatus") as keyof typeof usersStatusOptions;
  console.log(usersStatus);

  const users = await getUsers({
    // ...payload,
    usersStatus,
    boardId,
    page,
    currentUserId: Number(userId),
  });

  return {
    users,
    page,
  };
}
