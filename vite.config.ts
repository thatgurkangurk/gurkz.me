import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { kitRoutes } from "vite-plugin-kit-routes";
import type { KIT_ROUTES } from "$lib/ROUTES.js";

export default defineConfig({
	plugins: [kitRoutes<KIT_ROUTES>(), tailwindcss(), sveltekit(), devtoolsJson()]
});
