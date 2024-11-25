import Discord from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, SolidAuthConfig } from "@solid-mediakit/auth";
import { db } from "./db";
import { Permission } from "./db/schema";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}

export const authOpts: SolidAuthConfig = {
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      async profile(profile) {
        console.table(profile);
        return {
          id: profile.id,
          email: profile.email,
          name: profile.username,
          image: profile.avatar,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, user.id),
        columns: {
          permissions: true,
        },
      });
      return {
        ...session,
        user: {
          ...session.user,
          permissions: dbUser?.permissions,
          id: user.id,
        },
      };
    },
  },
  session: {
    strategy: "database",
  },
};
