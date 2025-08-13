import { browser } from "$app/environment";
import { createRouterClient } from "@orpc/server";
import { router } from "./server/router";

if (browser) {
	throw new Error("This file should not be imported in the browser");
}

export function createServerClient(headers: () => Headers) {
	return createRouterClient(router, {
		context: async () => ({
			reqHeaders: headers()
		})
	});
}
