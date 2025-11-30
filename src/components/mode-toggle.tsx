import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/lib/theme";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const iconBase = "h-[1.2rem] w-[1.2rem] !transition-all";

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      <Sun
        className={`${iconBase} scale-100 rotate-0 dark:scale-0 dark:-rotate-90`}
      />
      <Moon
        className={`${iconBase} absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
