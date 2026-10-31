import type { router } from "#lib/server/orpc/router.js";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

const link = new RPCLink({
	url: "/rpc",
	fetch: async (url, init) => {
		if (import.meta.env.SSR) {
			const { getRequestEvent } = await import("$app/server");
			return getRequestEvent().fetch(url, init);
		}

		return fetch(url, init);
	}
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
