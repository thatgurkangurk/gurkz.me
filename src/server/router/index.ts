import { getSession, login, logout } from "./auth";
import { getMusicIds } from "./music";

export const router = {
	music: {
		getMusicIds: getMusicIds
	},
	session: {
		get: getSession,
		logout: logout,
		login: login
	}
};
