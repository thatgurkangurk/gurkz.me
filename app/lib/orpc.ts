import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/solid-start";
import { getHeaders } from "@tanstack/solid-start/server";
import { router } from "../router/index";
import { createORPCClient } from "@orpc/client";
import { createORPCSolidQueryUtils } from "@orpc/solid-query";

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(router, {
			context: async () => ({
				headers: getHeaders()
			})
		})
	)
	.client((): RouterClient<typeof router> => {
		const link = new RPCLink({
			url: new URL("/api/rpc", window.location.href)
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createORPCSolidQueryUtils(client);
