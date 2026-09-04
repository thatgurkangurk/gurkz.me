import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";
import path from "node:path";
import wasm from "vite-plugin-wasm";

export default defineConfig({
	plugins: [
		wasm(),
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

			paths: {
				origin: "https://www.gurkz.me"
			},

			inspector: true
		}),
		devtoolsJson()
	],
	server: {
		fs: {
			allow: ["..", path.resolve(process.env.HOME || "~", ".cache")] // nub cache
		}
	}
});
