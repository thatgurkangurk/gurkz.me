import type { Cookie, Session } from "lucia";
import { lucia } from "../auth";

export async function createSession(userId: string): Promise<Session> {
	return await lucia.createSession(userId, {});
}

export function createSessionCookie(session: Session): Cookie {
	return lucia.createSessionCookie(session.id);
}
