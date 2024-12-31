import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/favorite-board";
import invariant from "tiny-invariant";
import { favoriteBoard } from "~/utils/board";
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);
  const favoriteStatus = await getRequestField("favorite-status", request, {
    stringified: false,
  });
  invariant(favoriteStatus);
  const isFavorite = favoriteStatus === "false" ? false : true;
  try {
    await favoriteBoard(Number(id), isFavorite);
  } catch (errors) {
    return data(
      {
        errors,
        id,
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
