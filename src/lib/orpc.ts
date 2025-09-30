import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { createORPCSvelteQueryUtils } from "@orpc/svelte-query";
import type { router } from "./server/router";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { browser } from "$app/environment";

const link = new RPCLink({
	url: () => {
		if (!browser) throw new Error("RPCLink cannot be used on the server");
		return `${window.location.origin}/rpc`;
	},
	method: (_, path) => {
		if (!browser) {
			return "GET";
		}

		// Use GET for read-like operations
		if (path.at(-1)?.match(/^(?:get|find|list|search)(?:[A-Z].*)?$/)) {
			return "GET";
		}

		return "POST";
	},
	plugins: [
		new BatchLinkPlugin({
			groups: [{ condition: () => true, context: {} }]
		})
	]
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link);

export const orpc = createORPCSvelteQueryUtils(client);
