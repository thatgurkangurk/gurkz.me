import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";
import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind(), auth()],
    output: "static",

    adapter: node({
        mode: "standalone",
    }),

    env: {
        schema: {
            DATABASE_URL: envField.string({
                access: "secret",
                context: "server",
            }),
        },
    },
});
