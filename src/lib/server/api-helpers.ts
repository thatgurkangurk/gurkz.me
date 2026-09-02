import { auth } from "#lib/server/auth.js";
import { isAPIError } from "better-auth/api";
import { Result, ok, err } from "neverthrow";
import type { Session, User } from "#lib/server/auth.js";

export type AuthError =
	| { type: "UNAUTHORIZED"; message: string }
	| { type: "RATE_LIMITED"; message: string }
	| { type: "INTERNAL_SERVER_ERROR"; message: string };

export type AuthResult = {
	user: User;
	session: Session;
};

export async function getSessionFromApiKey(
	request: Request
): Promise<Result<AuthResult, AuthError>> {
	const rawHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
	const apiKey = rawHeader?.replace(/^Bearer\s+/i, "").trim();

	if (!apiKey) {
		return err({ type: "UNAUTHORIZED", message: "missing api key" });
	}

	try {
		const res = await auth.api.getSession({
			headers: new Headers({
				"x-api-key": apiKey
			})
		});

		if (!res?.user || !res?.session) {
			return err({ type: "UNAUTHORIZED", message: "invalid or expired api key" });
		}

		return ok({
			user: res.user as User,
			session: res.session as Session
		});
	} catch (error) {
		if (isAPIError(error)) {
			if (error.status === 429) {
				return err({ type: "RATE_LIMITED", message: "too many requests. please slow down." });
			}

			if (error.status === 500) {
				return err({
					type: "INTERNAL_SERVER_ERROR",
					message: error.message || "internal server error"
				});
			}

			return err({ type: "UNAUTHORIZED", message: error.message || "invalid or expired api key" });
		}

		return err({ type: "UNAUTHORIZED", message: "invalid or expired api key" });
	}
}
