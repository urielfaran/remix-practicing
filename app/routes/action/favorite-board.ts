import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/favorite-board";
import invariant from "tiny-invariant";
import { favoriteBoard } from "~/utils/board.server";
import { data } from "react-router";
import { authenticator } from "~/auth/authenticator";
import {
  favoriteBoardResolver,
  favoriteBoardSchemaType,
} from "~/components/action-buttons/FavoriteBoard";
import { getValidatedFormData } from "remix-hook-form";

export async function action({ request }: Route.ActionArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<favoriteBoardSchemaType>(
    request,
    favoriteBoardResolver
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  const { isFavorite } = payload;

  try {
    await favoriteBoard(payload.id, isFavorite, Number(userId));
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: `Board ${
          isFavorite && "Remove From"
        } Favorites Toggle Has Been Failed`,
        toastContent: `Could not ${
          isFavorite ? "remove board from" : "add board to"
        } favorites!`,
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: `Board Has Been ${
      isFavorite ? "Removed From" : "Added To"
    } Favorites`,
    toastContent: `Board has been successfully ${
      isFavorite ? "removed From" : "added To"
    }  favorites!`,
  });
}
