import { useEffect } from "react";
import { toast } from "./use-toast";

export type ToastProps = {
  toastTitle: string;
  toastContent: string;
}

function useResponseToast(actionData: ToastProps | undefined) {
  useEffect(() => {
    if (actionData) {
      toast({
        title: actionData.toastTitle,
        description: actionData.toastContent,
      });
    }
  }, [actionData]);
}

export default useResponseToast;
