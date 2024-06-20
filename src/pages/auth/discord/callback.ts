import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import { lucia } from "@/lib/auth/lucia";
import { createDiscordSession } from "@/lib/auth/discord";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("discord_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const session = await createDiscordSession(code);
    if (!session) {
      console.log("no session");
      return new Response(
        JSON.stringify({
          message: "failed to create session",
        }),
        {
          status: 500,
        }
      );
    }
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return context.redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      console.log(e);
      return new Response(null, {
        status: 400,
      });
    }
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
}
