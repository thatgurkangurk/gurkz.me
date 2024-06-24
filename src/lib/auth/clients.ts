import { Discord } from "arctic";
import { getSecret } from "astro:env/server";

export const discord = new Discord(
  getSecret("DISCORD_CLIENT_ID"),
  getSecret("DISCORD_CLIENT_SECRET"),
  `${getSecret("SITE_URL")}/auth/discord/callback`
);
