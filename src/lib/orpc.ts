import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { router } from "./server/router";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const getORPCClient = createIsomorphicFn()
    .server(() =>
        createRouterClient(router, {
            context: async () => ({
                headers: getRequestHeaders(),
            }),
        }),
    )
    .client((): RouterClient<typeof router> => {
        const link = new RPCLink({
            url: "/api/rpc",
        });

        return createORPCClient(link);
    });

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
