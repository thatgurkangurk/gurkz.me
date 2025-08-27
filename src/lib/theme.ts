import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Theme = "dark" | "light";

const theme = atomWithStorage<Theme>("theme", "light");

function useTheme() {
  return useAtom(theme);
}

const themeScript = `(function () {
      var theme = localStorage.getItem("theme");
      if (theme) {
        document.documentElement.classList.add(JSON.parse(theme));
      }
    })();`;

export { theme, useTheme, themeScript };
