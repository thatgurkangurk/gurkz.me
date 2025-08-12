import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { createORPCSvelteQueryUtils } from "@orpc/svelte-query";
import type { router } from "./server/router";
import { base } from "$app/paths";
import { browser } from "$app/environment";

declare global {
	// eslint-disable-next-line no-var
	var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
	url: () => {
		if (!browser) {
			throw new Error("RPCLink is not allowed on the server side.");
		}

		return new URL(`${base}/rpc`, location.origin);
	}
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link);

export const orpc = createORPCSvelteQueryUtils(client);
