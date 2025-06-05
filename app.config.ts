import { defineConfig } from "@solidjs/start/config";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	vite: {
		plugins: [tailwind()],
		build: {
			rollupOptions: {
				external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"]
			}
		}
	},
	server: {
		esbuild: {
			options: {
				target: "esnext"
			}
		},
		rollupConfig: {
			external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"]
		}
	}
});
