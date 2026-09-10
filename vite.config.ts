import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
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
		})
	],
	ssr: {
		external: ["ffmpeg-static", "sharp"]
	},
	build: {
		rolldownOptions: {
			external: ["ffmpeg-static", "sharp"]
		}
	}
});
