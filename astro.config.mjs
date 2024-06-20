import { defineConfig, envField } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  security: {
    checkOrigin: true,
  },
  experimental: {
    env: {
      schema: {
        PUBLIC_SITE_URL: envField.string({
          context: "client",
          access: "public",
          optional: false,
        }),
        DISCORD_CLIENT_ID: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
        DISCORD_CLIENT_SECRET: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
      },
    },
  },
});
