import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "~/env";
import { Permissions } from "~/lib/permissions";
import { db, schema } from "~/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"], // CF
    },
  },
  plugins: [admin(), tanstackStartCookies()],
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      prompt: "consent",
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: (profile) => {
        return {
          name: profile.username,
        };
      },
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      prompt: "consent",
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
        };
      },
    },
  },
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
