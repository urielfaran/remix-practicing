import { List } from "@prisma/client";
import { useFetcher } from "react-router";

interface UpdateListInputProps {
  list: List;
}
function UpdateListInput({ list }: UpdateListInputProps) {
  const fetcher = useFetcher();

  return (
    <div
      className="p-2 pb-0 flex-1 outline-none"
      onBlur={(e) => {
        const editTitle = String(e.currentTarget.textContent).trim();
        if (list.title !== editTitle.trim()) {
          fetcher.submit(
            {
              title: JSON.stringify(String(e.target.textContent)),
              id: list.id,
              _action: JSON.stringify("update-list"),
            },
            {
              method: "post",
            }
          );
        }
      }}
      contentEditable
      dangerouslySetInnerHTML={{
        __html: fetcher.formData
          ? JSON.parse(fetcher.formData.get("title") as string)
          : list.title,
      }}
    />
  );
}

export default UpdateListInput;
