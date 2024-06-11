import type { QueryClient } from "@tanstack/svelte-query";
import { svelteQueryWrapper } from "trpc-svelte-query-adapter";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { Router } from "./router";
import { env } from "$env/dynamic/public";

const client = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			// Replace this URL with that of your tRPC server
			url: `${env.PUBLIC_DOMAIN}/trpc/`
		})
	]
});

export function trpc(queryClient?: QueryClient) {
	return svelteQueryWrapper<Router>({
		client,
		queryClient
	});
}
