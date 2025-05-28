import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { createORPCSolidQueryUtils } from "@orpc/solid-query";
import type { router } from "~/server/router";
import { isServer } from "solid-js/web";

if (isServer) {
	await import("./orpc.server");
}

declare global {
	// eslint-disable-next-line no-var
	var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
	url: () => {
		if (typeof window === "undefined") {
			throw new Error("RPCLink is not allowed on the server side.");
		}

		return new URL("/rpc", window.location.href);
	}
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link);

export const orpc = createORPCSolidQueryUtils(client);
