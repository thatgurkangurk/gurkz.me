import { router } from "@/server/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders, getWebRequest } from "@tanstack/react-start/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const getClientLink = createIsomorphicFn()
  .client(
    () =>
      new RPCLink({
        url: `${window.location.origin}/api/rpc`,
      })
  )
  .server(
    () =>
      new RPCLink({
        url: () => new URL("/api/rpc", getWebRequest().url).toString(),
        headers: () => getHeaders(),
      })
  );

const clientLink = getClientLink();

export const client: RouterClient<typeof router> = createORPCClient(clientLink);

export const orpc = createTanstackQueryUtils(client);
