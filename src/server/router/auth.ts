import { pub } from "../orpc";

export const getSession = pub.handler(async ({ context }) => {
	return context.user;
});
