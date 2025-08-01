import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		visualizer(),
		icons({
			compiler: "svelte"
		})
	]
});
