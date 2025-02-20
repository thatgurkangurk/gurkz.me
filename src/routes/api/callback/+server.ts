import { createAuthClient, setTokens } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get("code");
	const authClient = createAuthClient(event);
	const tokens = await authClient.exchange(code!, event.url.origin + "/api/callback");
	if (!tokens.err) {
		setTokens(event, tokens.tokens.access, tokens.tokens.refresh);
	} else {
		throw tokens.err;
	}
	return redirect(302, `/`);
};
