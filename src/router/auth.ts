import { user } from "$lib/server/auth-subject";
import { nullish } from "valibot";
import { pub } from "../orpc";

export const getSession = pub
	.route({
		method: "GET"
	})
	.output(nullish(user))
	.handler(({ context }) => {
		context.resHeaders?.set(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, proxy-revalidate"
		);
		if (!context.session) return null;

		return {
			...context.session
		};
	});
