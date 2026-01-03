import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import simpleScope from "vite-plugin-simple-scope";

export default defineConfig({
	plugins: [simpleScope(), tailwindcss(), sveltekit(), devtoolsJson()]
});
