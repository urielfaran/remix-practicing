import { ActionFunctionArgs, data, redirect } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import AddBoardButton from "~/components/action-buttons/AddBoardButton";
import DisplayBoard from "~/components/display-data/DisplayBoard";
import FilterBoards from "~/components/filter-components/FilterBoards";
import {
  createBoardResolver,
  createBoardSchemaType,
  updateBoardResolver,
  updateBoardSchemaType,
} from "~/components/forms/BoardForm";
import { createBoard, getFilterBoards, updateBoard } from "~/utils/board";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/_index";

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
      try {
        const newBoard = await createBoard({
          name: payload.name,
          backgroundColor: payload.backgroundColor,
        });
        return redirect(`/board/${newBoard.id}/${newBoard.name}`, {
          headers: {
            toastTitle: "Board Has Been Created",
            toastContent: "New board has been added to your list!",
          },
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
    default:
      return null;
  }
}
