import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { permissionType, shareBoardSchema } from "~/schemas/shareBoard.schema";
import { AddUserPermission } from "../AddUserPermission";
import { UserWithBoardRelation } from "../board-components/BoardHeader";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UpdateUserPermissionTable from "../UpdateUserPermissionTable";
import { Separator } from "../ui/separator";

interface ShareBoardDialogProps extends PropsWithChildren {
}

export const shareBoardResolver = zodResolver(shareBoardSchema);
export type shareBoardType = z.infer<typeof shareBoardSchema>;

export const permissionTypeResolver = zodResolver(permissionType);
export type permissionType = z.infer<typeof permissionType>;

function ShareBoardDialog({
  children,
}: ShareBoardDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="min-w-[425px] min-h-60 max-h-96 overflow-y-auto flex flex-col space-y-3"
      >
        <DialogTitle>Share Your Board With Other Users</DialogTitle>
        <AddUserPermission
        />
        <Separator />
        <UpdateUserPermissionTable
        />
      </DialogContent>
    </Dialog>
  );
}

export default ShareBoardDialog;
