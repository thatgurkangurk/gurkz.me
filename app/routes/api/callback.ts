import { createAPIFileRoute } from "@tanstack/solid-start/api";
import { createAuthClient, setTokens } from "../../server/auth";

export const APIRoute = createAPIFileRoute("/api/callback")({
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const authClient = createAuthClient();
		const tokens = await authClient.exchange(code!, url.origin + "/api/callback");
		if (!tokens.err) {
			setTokens({
				access: tokens.tokens.access,
				refresh: tokens.tokens.refresh
			});
		} else {
			throw tokens.err;
		}

		return Response.redirect("/", 302);
	}
});
