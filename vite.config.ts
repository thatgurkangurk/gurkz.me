import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import icons from "unplugin-icons/vite";
import { MagicRegExpTransformPlugin } from "magic-regexp/transform";
import { partytownVite } from "@qwik.dev/partytown/utils";
import path from "node:path";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		visualizer(),
		icons({
			compiler: "svelte"
		}),
		MagicRegExpTransformPlugin.vite(),
		partytownVite({
			dest: path.join(__dirname, "build", "client", "~partytown")
		})
	]
});
