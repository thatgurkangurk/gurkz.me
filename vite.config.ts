import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { join } from "node:path";
import { partytownVite } from "@qwik.dev/partytown/utils";

const ReactCompilerConfig = {};

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    devtoolsJson(),
    tailwind(),
    tsConfigPaths(),
    tanstackStart({ customViteReactPlugin: true, target: "bun" }),
    viteReact({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
          jotaiDebugLabel,
          jotaiReactRefresh,
        ],
      },
    }),
    partytownVite({
      dest: join(
        __dirname,
        ".tanstack",
        "start",
        "build",
        "client-dist",
        "~partytown"
      ),
    }),
  ],
});
