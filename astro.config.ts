import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import inoxToolsRequestNanostores from "@inox-tools/request-nanostores";
import { defineConfig, envField } from "astro/config";
import { fileURLToPath } from "node:url";
import simpleStackForm from "simple-stack-form";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        simpleStackForm(),
        solidJs(),
        inoxToolsRequestNanostores(),
    ],
    output: "server",

    adapter: node({
        mode: "standalone",
    }),

    vite: {
        resolve: {
            alias: {
                "lucide-solid/icons": fileURLToPath(
                    new URL(
                        "./node_modules/lucide-solid/dist/source/icons",
                        import.meta.url
                    )
                ),
            },
        },
    },

    env: {
        schema: {
            DATABASE_URL: envField.string({
                access: "secret",
                context: "server",
            }),
            DISCORD_CLIENT_ID: envField.string({
                access: "secret",
                context: "server",
            }),
            DISCORD_CLIENT_SECRET: envField.string({
                access: "secret",
                context: "server",
            }),
            AUTH_SECRET: envField.string({
                access: "secret",
                context: "server",
            }),
        },
    },
});
