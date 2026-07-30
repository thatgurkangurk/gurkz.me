import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import simpleScope from "vite-plugin-simple-scope";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";

export default defineConfig({
	plugins: [
		simpleScope(),
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),

			adapter: adapter(),

			csrf: {
				trustedOrigins: ["https://www.gurkz.me", "https://gurkz.me"]
			},

			experimental: {
				remoteFunctions: true
			},

			compilerOptions: {
				experimental: {
					async: true
				}
			},

			vitePlugin: {
				inspector: true
			}
		}),
		devtoolsJson()
	]
});
