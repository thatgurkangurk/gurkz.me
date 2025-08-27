import { router } from "@/server/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
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
        url: "http://localhost:3000/api/rpc",
        headers: () => getHeaders(),
      })
  );

export const client: RouterClient<typeof router> =
  createORPCClient(getClientLink());

export const orpc = createTanstackQueryUtils(client);
