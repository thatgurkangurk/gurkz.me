import type { RequestEvent } from "../$types";
import { createDiscordSession } from "$lib/auth/discord";
import { createSessionCookie } from "$lib/auth/session";
import { OAuth2RequestError } from "arctic";
import { redirect } from "@sveltejs/kit";

function sanitiseRedirectUrl(url: string) {
    if (!url.startsWith("/")) {
        // tried to redirect outside of the website
        return "/"
    }

    return url;
}


export async function GET(event: RequestEvent): Promise<Response> {
    const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("discord_oauth_state") ?? null;
    const redirectTo = event.cookies.get("redirect") ?? "/"

    if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

    try {
        const session = await createDiscordSession(code);
        const sessionCookie = createSessionCookie(session!);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        })
        event.cookies.delete("redirect", {
            path: "/"
        })
    } catch (e) {
        if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
    } finally {
        redirect(302, sanitiseRedirectUrl(redirectTo))
    }
}