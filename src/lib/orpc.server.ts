import { createRouterClient } from "@orpc/server";
import { router } from "./server/router";

export function createServerClient(headers: () => Headers) {
	return createRouterClient(router, {
		context: async () => ({
			reqHeaders: headers()
		})
	});
}
