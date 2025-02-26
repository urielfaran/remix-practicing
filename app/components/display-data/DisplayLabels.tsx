import { Label } from "@prisma/client";
import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import EditLabelDialog from "../dialogs/EditLabelDialog";
import { Badge } from "../ui/badge";
import { dialogStyleType } from "../dialogs/EditTodoDialog";

interface DisplayLabelsProps {
  labels: Label[];
  todoId: number;
  dialogStyle: dialogStyleType;
}

function DisplayLabels({ labels, todoId, dialogStyle }: DisplayLabelsProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <div className="flex flex-row gap-1 max-w-full overflow-x-auto whitespace-nowrap scrollbar-none">
      {labels.map((label) => (
        <fetcher.Form
          method="POST"
          action={`/action/delete-label`}
          key={label.id}
          className="flex-shrink-0"
        >
          <EditLabelDialog
            todoId={todoId}
            label={label}
            dialogStyle={dialogStyle}
          >
            <Badge
              className="h-[20px] w-[52px] relative group cursor-pointer"
              style={{ backgroundColor: label.backgroundColor || "grey" }}
            >
              {label.text}         
            </Badge>
          </EditLabelDialog>
        </fetcher.Form>
      ))}
    </div>
  );
}

export default DisplayLabels;
