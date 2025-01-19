import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Switch } from "./ui/switch";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
      <Switch
        id="theme"
        onCheckedChange={() =>
          setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
        }
      />
      <Moon className=" h-[1rem] w-[1rem] transition-all dark:rotate-0 dark: -rotate-0" />
    </div>
  );
}
