import { zodResolver } from "@hookform/resolvers/zod";
import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { updateLabelSchema } from "~/schemas/label.schema";
import { updateLabel } from "~/utils/label.server";
import { Route } from "./+types/update-label";

export type updateLabelSchemaType = z.infer<typeof updateLabelSchema>;
export const updateLabelReslover = zodResolver(updateLabelSchema);

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: payload,
    receivedValues: defaultValues,
  } = await getValidatedFormData<updateLabelSchemaType>(
    request,
    updateLabelReslover
  );

  if (errors) {
    return data({ errors, defaultValues, payload }, { status: 400 });
  }

  try {
    await updateLabel({ ...payload });
  } catch (errors) {
    return data(
      {
        errors,
        payload,
        toastTitle: "Label Updation Has Been Failed",
        toastContent: "Could not update label!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Label Has Been Updated",
    toastContent: "Label has been updated successfully!",
  });
}
