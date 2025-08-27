import { theme } from "@/lib/theme";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

export function useSyncThemeClass() {
  const currentTheme = useAtomValue(theme);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains(currentTheme)) {
      root.classList.remove("light", "dark");
      root.classList.add(currentTheme);
    }
  }, [currentTheme]);
}
