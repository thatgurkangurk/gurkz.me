import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";
import { router } from "../../app/router/index";
import { createORPCSolidQueryUtils } from "@orpc/solid-query";

const rpcLink = new RPCLink({
	url: new URL(
		"/rpc",
		typeof window !== "undefined" ? window.location.href : "http://localhost:3000"
	)
});

export const client: RouterClient<typeof router> = createORPCClient(rpcLink);

export const orpc = createORPCSolidQueryUtils(client);
