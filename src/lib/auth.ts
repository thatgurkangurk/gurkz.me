import Discord from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, SolidAuthConfig } from "@solid-mediakit/auth";
import { db } from "./db";

declare module "@solid-mediakit/auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
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
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  session: {
    strategy: "database",
  },
};