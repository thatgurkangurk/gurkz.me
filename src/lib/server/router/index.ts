import { getSession, signIn, signOut } from "./session";

export const router = {
	session: {
		get: getSession,
		signIn: signIn,
		signOut: signOut
	}
};
