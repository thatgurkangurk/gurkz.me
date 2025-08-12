import { browser } from "$app/environment";
import { createRouterClient } from "@orpc/server";
import { router } from "./server/router";

if (browser) {
	throw new Error("This file should not be imported in the browser");
}

(globalThis as any).$client =
	(globalThis as any).$client ??
	createRouterClient(router, {
		context: async () => ({})
	});
