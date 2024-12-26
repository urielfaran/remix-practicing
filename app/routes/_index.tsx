import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import AddBoardButton from "~/components/action-buttons/AddBoardButton";
import DisplayBoard from "~/components/display-data/DisplayBoard";
import { createBoardSchema, updateBoardSchema } from "~/schemas/boardSchema";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getFilterBoards,
  updateBoard,
} from "~/utils/board";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/_index";
import FilterBoards from "~/components/filter-components/FilterBoards";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";

  const boards = await getFilterBoards(query);

  return { boards };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { boards } = loaderData;
  return (
    <div className="w-4/5 mx-auto">
      <div className="flex flex-row justify-end">
        <FilterBoards />
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <AddBoardButton />
        {boards.map((board, index) => (
          <DisplayBoard board={board} key={index} />
        ))}
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const _action = await getRequestField("_action", request);

  type createBoardSchemaType = z.infer<typeof createBoardSchema>;
  const createBoardResolver = zodResolver(createBoardSchema);
  type updateBoardSchemaType = z.infer<typeof updateBoardSchema>;
  const updateBoardResolver = zodResolver(updateBoardSchema);

  switch (_action) {
    case "create-board": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createBoardSchemaType>(
        request,
        createBoardResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      console.log(payload)
      try {
        await createBoard({
          name: payload.name,
          backgroundColor: payload.backgroundColor
        });
      } catch (err) {
        return data(
          {
            err,
            payload,
            toastTitle: "Board Creation Has Been Failed",
            toastContent: "Could not create board!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "Board Has Been Created",
        toastContent: "New board has been added to your list!",
      });
    }

    case "update-board": {
      const {
        errors,
        data: payloud,
        receivedValues: defaultValues,
      } = await getValidatedFormData<updateBoardSchemaType>(
        request,
        updateBoardResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payloud }, { status: 400 });
      }

      try {
        await updateBoard({
          id: payloud.id,
          name: payloud.name,
          backgroundColor: payloud.backgroundColor,
        });
      } catch (err) {
        return Response.json(
          {
            err,
            toastTitle: "Board Updation Has Been Failed",
            toastContent: "Could not update board!",
          },
          { status: 400 }
        );
      }
      return Response.json({
        ok: true,
        toastTitle: "Board Has Been Updated",
        toastContent: "Board has been updated successfully!",
      });
    }
    case "delete-board": {
      const id = await getRequestField("id", request, {
        stringified: false,
      });
      invariant(id);

      try {
        await deleteBoard(Number(id));
      } catch (errors) {
        return data(
          {
            errors,
            id,
            toastTitle: "Todo Deletion Has Been Failed",
            toastContent: "Could not delete todo!",
          },
          { status: 400 }
        );
      }
      return data({
        toastTitle: "Todo Has Been Deleted",
        toastContent: "Todo has been deleted successfully!",
      });
    }

    default:
      return null;
  }
}
