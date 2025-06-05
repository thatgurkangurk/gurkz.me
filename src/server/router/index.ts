import { getSession } from "./auth";
import { getMusicIds } from "./music";

export const router = {
	music: {
		getMusicIds: getMusicIds
	},
	session: {
		get: getSession
	}
};
