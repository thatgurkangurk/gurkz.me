import { createServerFn } from "@tanstack/solid-start";
import { deleteCookie, getCookie, getHeaders, sendRedirect } from "@tanstack/solid-start/server";
import { createAuthClient, setTokens } from "../server/auth";
import { subjects } from "../server/auth/subjects";
import { redirect } from "@tanstack/solid-router";

const client = createAuthClient();

export const signIn = createServerFn({
	method: "POST"
}).handler(async () => {
	const accessToken = getCookie("access_token");
	const refreshToken = getCookie("refresh_token");

	if (accessToken) {
		const verified = await client.verify(subjects, accessToken, { refresh: refreshToken });
		if (!verified.err && verified.tokens) {
			setTokens({
				access: verified.tokens.access,
				refresh: verified.tokens.refresh
			});
			throw redirect({
				statusCode: 302,
				to: "/"
			});
		}
	}

	const headers = getHeaders();
	const host = headers.host;
	const protocol = host?.includes("localhost") ? "http" : "https";
	const { url } = await client.authorize(`${protocol}://${host}/api/callback`, "code");
	await sendRedirect(url, 302);
});

export const signOut = createServerFn().handler(async () => {
	deleteCookie("access_token", { path: "/" });
	deleteCookie("refresh_token", { path: "/" });

	await sendRedirect("/", 302);
});
