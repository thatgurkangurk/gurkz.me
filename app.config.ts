import { defineConfig } from "@solidjs/start/config";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	vite: {
		plugins: [tailwind()]
	},
	server: {
		esbuild: {
			options: {
				target: "esnext"
			}
		}
	}
});
