import { Label } from "@prisma/client";
import { Badge } from "../ui/badge";
import DeleteButton from "../action-buttons/DeleteButton";
import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface DisplayLabelsProps {
  labels: Label[];
}
function DisplayLabels({ labels }: DisplayLabelsProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <div className="flex flex-row gap-1">
      {labels.map((label, index) => (
        <fetcher.Form method="POST" action={`/action/delete-label`}>
          <Badge
            key={index}
            className="min-h-3 min-w-10 relative group"
            style={{ backgroundColor: label.backgroundColor || "grey" }}
          >
            <input name="id" hidden readOnly value={label.id} />

            <Button
              type="submit"
              variant={"ghost"}
              className="absolute top-[-6px] right-[-6px] p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent w-1 h-1"
              >
              <X className="text-red-500" />
            </Button>
          </Badge>
        </fetcher.Form>
      ))}
    </div>
  );
}

export default DisplayLabels;
