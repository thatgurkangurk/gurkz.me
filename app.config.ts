import { defineConfig } from "@tanstack/solid-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	vite: {
		plugins: [
			tailwind(),
			tsConfigPaths({
				projects: ["./tsconfig.json"]
			})
		]
	}
});
