import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { QueryClient } from "@tanstack/react-query";
import { type PermissionsDefinition } from "#lib/permix.js";
import { createPermix } from "permix";

export function getRouter() {
    const queryClient = new QueryClient();

    const permix = createPermix<PermissionsDefinition>();

    const router = createRouter({
        routeTree,
        scrollRestoration: true,
        context: { queryClient, permix },
    });

    setupRouterSsrQueryIntegration({
        router,
        queryClient,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
