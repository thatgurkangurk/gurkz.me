import adapter from "svelte-adapter-bun-next";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import type { Config } from "@sveltejs/kit";

const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			precompress: true
		})
	}
} satisfies Config;

export default config;
