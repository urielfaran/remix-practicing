import { PropsWithChildren, useContext, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { labelColors } from "~/utils/labels";
import { Button } from "./ui/button";
import { Form, useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";
import { z } from "zod";
import { baseLabelSchema } from "~/schemas/label.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LabelForm from "./forms/LabelForm";

interface AddLabelPopoverProps extends PropsWithChildren {
  todoId: number;
}

function AddLabelPopover({ children, todoId }: AddLabelPopoverProps) {
  const [chosenBackground, setChosenBackground] = useState("");
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" side="right">
        <h2 className="font-bold text-center">Add label to your todo</h2>
        <LabelForm todoId={todoId} />
      </PopoverContent>
    </Popover>
  );
}

export default AddLabelPopover;
