import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import reactCompiler from "babel-plugin-react-compiler";
import jotai from "jotai/babel/preset";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		devtools(),
		devtoolsJson(),
		tailwindcss(),
		tsConfigPaths(),
		nitro(),
		tanstackStart(),
		viteReact({
			babel: {
				plugins: [reactCompiler],
				presets: [jotai],
			},
		}),
	],
	nitro: {
		preset: "bun",
	},
});
