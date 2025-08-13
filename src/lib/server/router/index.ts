import { getMusicIds } from "./music";
import { getSession } from "./session";

export const router = {
	music: {
		get: getMusicIds
	},
	session: {
		get: getSession
	}
};
