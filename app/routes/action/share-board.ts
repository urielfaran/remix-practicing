import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { shareBoardResolver, shareBoardType } from "~/components/dialogs/ShareBoardDialog";
import type { Route } from "./+types/share-board";

export async function action({ request }: Route.ActionArgs) {
 
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<shareBoardType>(request, shareBoardResolver);

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  return {};
}
