import { getUser } from "./auth";
import { getMusicIds } from "./music";

export const router = {
	music: {
		getMusicIds: getMusicIds
	},
	auth: {
		getUser: getUser
	}
};
