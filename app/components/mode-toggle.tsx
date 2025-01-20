import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Switch } from "./ui/switch";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Switch
        id="theme"
        checked={theme === Theme.DARK}
        onCheckedChange={() =>
          setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
        }
      />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  );
}
