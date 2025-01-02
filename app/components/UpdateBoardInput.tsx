import { Board } from "@prisma/client";
import { useFetcher } from "react-router";

interface UpdateBoardInputProps {
  board: Board;
}
function UpdateBoardInput({ board }: UpdateBoardInputProps) {
  const fetcher = useFetcher();

  return (
    <div
      className="m-2 outline-none"
      // onClick={(e)=> e.stopPropagation()}
      onBlur={(e) => {
        const editName = String(e.currentTarget.textContent).trim();
        if (board.name !== editName.trim()) {
          fetcher.submit(
            {
              name: JSON.stringify(String(e.target.textContent)),
              id: board.id,
            },
            {
              action: "/action/update-board",
              method: "post",
            }
          );
        }
      }}
      contentEditable
      dangerouslySetInnerHTML={{
        __html: fetcher.formData
          ? JSON.parse(fetcher.formData.get("name") as string)
          : board.name,
      }}
    />
  );
}

export default UpdateBoardInput;
