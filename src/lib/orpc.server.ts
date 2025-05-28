if (!isServer) {
	throw new Error("This file should not be imported in the browser");
}

import { createRouterClient } from "@orpc/server";
import { getRequestEvent, isServer } from "solid-js/web";
import { db } from "~/server/db";
import { router } from "~/server/router";

globalThis.$client = createRouterClient(router, {
	/**
	 * Provide initial context if needed.
	 *
	 * Because this client instance is shared across all requests,
	 * only include context that's safe to reuse globally.
	 * For per-request context, use middleware context or pass a function as the initial context.
	 */
	context: async () => {
		const headers = getRequestEvent()?.request.headers;

		return {
			headers,
			db: db
		};
	}
});
