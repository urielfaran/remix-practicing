import { User } from "@prisma/client";
import { PropsWithChildren } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import UserCredentialsForm from "../forms/UserCredentialsForm";

interface UserSettingsProps extends PropsWithChildren {
  open: boolean;
  user: User;
}
function UserSettings({ children, open, user }: UserSettingsProps) {
  return (
    <Popover open={open}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="min-w-48 m-1 min-h-52" side="right">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">User settings</h4>
          <p className="text-sm text-muted-foreground">
            Set your user settings here.
          </p>
        </div>
        <UserCredentialsForm user={user} />
      </PopoverContent>
    </Popover>
  );
}

export default UserSettings;
