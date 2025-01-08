import type { Permission, Role } from "./src/db/schema";
import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";
import auth from "auth-astro";
import simpleStackForm from "simple-stack-form";

import inoxToolsRequestNanostores from "@inox-tools/request-nanostores";

declare module "@auth/core/types" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            permissions: Permission[];
            role: Role;
        } & DefaultSession["user"];
    }
}

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind({
        applyBaseStyles: false,
    }), auth(), simpleStackForm(), solidJs(), inoxToolsRequestNanostores()],
    output: "server",

    adapter: node({
        mode: "standalone",
    }),

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