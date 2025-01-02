import { useFetcher } from "react-router";
import { cn } from "~/lib/utils";

interface EditableTextProps {
  id: number;
  text: string;
  actionName: string;
  fieldName: string;
  className?: string;
}

function EditableText({
  actionName,
  id,
  text,
  className,
  fieldName,
}: EditableTextProps) {
  const fetcher = useFetcher();
  return (
    <div
      className={cn("outline-none", className)}
      onBlur={(e) => {
        const editText = String(e.currentTarget.textContent).trim();
        if (text !== editText.trim()) {
          fetcher.submit(
            {
              [fieldName]: JSON.stringify(String(e.target.textContent)),
              id: id,
            },
            {
              action: actionName,
              method: "post",
            }
          );
        }
      }}
      contentEditable
      dangerouslySetInnerHTML={{
        __html: fetcher.formData
          ? JSON.parse(fetcher.formData.get(fieldName) as string)
          : text,
      }}
    />
  );
}

export default EditableText;
