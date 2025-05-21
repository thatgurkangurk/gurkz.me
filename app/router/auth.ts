import { or } from "../server/orpc";

export const getUser = or.handler(({ context }) => {
	return {
		user: context.user
	};
});
