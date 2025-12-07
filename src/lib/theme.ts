import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";

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

function useSyncThemeClass() {
	const currentTheme = useAtomValue(theme);

	useEffect(() => {
		const root = document.documentElement;
		if (!root.classList.contains(currentTheme)) {
			root.classList.remove("light", "dark");
			root.classList.add(currentTheme);
		}
	}, [currentTheme]);
}

export { theme, useTheme, themeScript, useSyncThemeClass };
