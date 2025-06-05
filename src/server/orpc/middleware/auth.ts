import { getDB } from "~/server/db";
import { base, Context } from "../base";
import cookie from "cookie";
import { client } from "~/lib/auth/client";
import { getOrCreateUser, subjects } from "~/lib/auth/subjects";
import { setTokens } from "~/lib/auth/tokens";
import { User } from "~/lib/schema/user";

export const authMiddleware = base
	.$context<{ db: ReturnType<typeof getDB> } & Context>()
	.middleware(async ({ context, next }) => {
		const { headers } = context;
		const cookieHeader = headers.get("Cookie");
		if (!cookieHeader) {
			console.warn("no cookie header");
			return next({
				context: {
					user: null as User | null
				}
			});
		}

		const cookies = new Map(Object.entries(cookie.parse(cookieHeader)));
		const accessToken = cookies.get("access_token");
		const refreshToken = cookies.get("refresh_token");

		if (!accessToken) {
			console.warn("no access token");
			return next({
				context: {
					user: null as User | null
				}
			});
		}

		const verified = await client.verify(subjects, accessToken, {
			refresh: refreshToken
		});

		if (verified.err) {
			console.warn("verified error");
			console.error(verified.err);
			return next({
				context: {
					user: null as User | null
				}
			});
		}

		if (verified.tokens) {
			await setTokens(verified.tokens.access, verified.tokens.refresh);
		}

		const user = await getOrCreateUser({
			id: verified.subject.properties.id,
			username: verified.subject.properties.username
		});

		return next({
			context: {
				user: user as User | null
			}
		});
	});
