import { deleteCookie, getCookie, getEvent } from "vinxi/http";
import { protectedProcedure, pub } from "../orpc";
import { z } from "zod/v4";
import { ORPCError } from "@orpc/client";
import { setTokens } from "~/lib/auth/tokens";
import { client } from "~/lib/auth/client";
import { subjects } from "~/lib/auth/subjects";

export const getSession = pub.handler(async ({ context }) => {
	return {
		user: context.user
	};
});

export const logout = protectedProcedure.input(z.void()).handler(async () => {
	const event = getEvent();
	deleteCookie(event, "access_token");
	deleteCookie(event, "refresh_token");

	return {
		redirectTo: "/"
	};
});

export const login = pub
	.input(z.void())
	.output(
		z.object({
			redirectTo: z.string()
		})
	)
	.handler(async ({ context }) => {
		if (context.user)
			throw new ORPCError("CONFLICT", {
				message: "you are already signed in"
			});

		const event = getEvent();
		const accessToken = getCookie(event, "access_token");
		const refreshToken = getCookie(event, "refresh_token");

		if (accessToken) {
			const verified = await client.verify(subjects, accessToken, {
				refresh: refreshToken
			});
			if (!verified.err && verified.tokens) {
				await setTokens(verified.tokens.access, verified.tokens.refresh);
				return {
					redirectTo: "/"
				};
			}
		}

		const headers = event.headers;
		const host = headers.get("host");
		const protocol = host?.includes("localhost") ? "http" : "https";
		const { url } = await client.authorize(`${protocol}://${host}/api/auth/callback`, "code");

		return {
			redirectTo: url
		};
	});
