import type { DiscordTokens } from "arctic";
import { discord } from "./clients";
import { db } from "../db";
import { users } from "../schema/user";
import { createSession } from "./session";
import { request } from "undici";
import { eq } from "drizzle-orm";

export async function getDiscordAuthorisationUrl(state: string): Promise<URL> {
  return await discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  });
}

export async function createDiscordSession(idToken: string) {
  const tokens: DiscordTokens = await discord.validateAuthorizationCode(
    idToken
  );
  const discordUserResponse = await request(
    "https://discord.com/api/users/@me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    }
  );

  const response = (await discordUserResponse.body.json()) as any;

  const discordUserResult: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  } = {
    avatar_url: `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}`,
    ...response,
  };

  // Replace this with your own DB client.
  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.discordId, discordUserResult.id),
  });

  if (existingUser) {
    if (existingUser.username !== discordUserResult.username) {
      await db
        .update(users)
        .set({ username: discordUserResult.username })
        .where(eq(users.discordId, discordUserResult.id));
    }
    const session = await createSession(existingUser.id);
    return session;
  }

  const [user] = await db
    .insert(users)
    .values({
      discordId: discordUserResult.id,
      username: discordUserResult.username,
      email: discordUserResult.email,
      profilePictureUrl: `https://cdn.discordapp.com/avatars/${discordUserResult.id}/${response.avatar}`,
    })
    .returning();

  if (!user) {
    console.error("user failed to create");
    return null;
  }

  const session = await createSession(user.id);
  return session;
}
