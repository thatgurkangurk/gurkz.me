import { getMusicIds } from "./music";
import { getSession, signIn, signOut } from "./session";

export const router = {
	session: {
		get: getSession,
		signIn: signIn,
		signOut: signOut
	},
	music: {
		get: getMusicIds
	}
};
