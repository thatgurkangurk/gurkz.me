import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie, getHeader, setCookie } from "vinxi/http";
import { lucia } from "./lib/auth";
import { verifyRequestOrigin } from "lucia";

export default createMiddleware({
	onRequest: async (e) => {
		if (e.request.method !== "GET") {
			const originHeader = getHeader("Origin") ?? null;
			const hostHeader = getHeader("Host") ?? null;
			if (
				!originHeader ||
				!hostHeader ||
				!verifyRequestOrigin(originHeader, [hostHeader])
			) {
				e.nativeEvent.node.res.writeHead(403).end();
				return;
			}
		}

		const sessionId = getCookie(lucia.sessionCookieName);

		if (!sessionId) {
			return;
		}

		const { session, user } = await lucia.validateSession(sessionId);

		if (session?.fresh) {
			const cookie = lucia.createSessionCookie(session.id);

			setCookie(cookie.name, cookie.value, cookie.attributes);
		}

		if (!session) {
			const cookie = lucia.createBlankSessionCookie();

			setCookie(cookie.name, cookie.value, cookie.attributes);
		}

		e.locals.user = user;
		e.locals.session = session;
	},
});
