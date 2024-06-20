import { Discord } from "arctic";
import { PUBLIC_SITE_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export const discord = new Discord(
  getSecret("DISCORD_CLIENT_ID"),
  getSecret("DISCORD_CLIENT_SECRET"),
  `${PUBLIC_SITE_URL}/auth/discord/callback`
);
