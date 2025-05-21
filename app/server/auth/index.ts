import { createClient } from "@openauthjs/openauth/client";
import { getCookie, setCookie } from "@tanstack/solid-start/server";
import { env } from "~/env";
import { subjects } from "./subjects";
import { db } from "../db";
import { users } from "../schema/user";
import { eq } from "drizzle-orm";

export function createAuthClient() {
	return createClient({
		clientID: env.PASSPORT_CLIENT_ID,
		issuer: env.REMOTE_AUTH_HOST
	});
}

export function setTokens({ access, refresh }: { access: string; refresh: string }) {
	setCookie("refresh_token", refresh, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 34560000
	});
	setCookie("access_token", access, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 34560000
	});
}

export async function getOrCreateUser(id: string, username: string) {
	const user = await db.transaction(async (tx) => {
		const result = await tx.query.users.findFirst({ where: eq(users.id, id) });

		if (!result) {
			const [newUser] = await tx.insert(users).values({ id: id, name: username }).returning();

			return newUser;
		}

		return result;
	});

	return user;
}

export async function getSession() {
	const client = createAuthClient();
	const accessToken = getCookie("access_token");

	if (!accessToken) return;

	const refreshToken = getCookie("refresh_token");
	const verified = await client.verify(subjects, accessToken, { refresh: refreshToken });
	if (verified.err) throw verified.err;

	if (verified.tokens)
		setTokens({ access: verified.tokens.access, refresh: verified.tokens.refresh });

	const user = await getOrCreateUser(
		verified.subject.properties.id,
		verified.subject.properties.username
	);

	return {
		username: user.name,
		...user
	};
}
