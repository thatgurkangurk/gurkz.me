import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { Permissions } from "./permissions";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["https://www.gurkz.me", "https://gurkz.me"],
  user: {
    additionalFields: {
      permissions: {
        type: "string[]",
        required: true,
        defaultValue: ["DEFAULT"],
        input: false,
        fieldName: "permissions",
        validator: {
          input: Permissions.array(),
          output: Permissions.array(),
        },
      },
    },
  },
});

export type User = typeof auth.$Infer.Session.user;
