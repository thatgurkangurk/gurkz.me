import { useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
import {
    Outlet,
    createRootRouteWithContext,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Navbar } from "#lib/components/navbar.js";
import "../styles.css";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#lib/server/auth.js";
import { authClient } from "#lib/auth.js";
import { getRules, type PermissionsDefinition } from "#lib/permix.js";
import { type Permix } from "permix";
import { getPermixState } from "#lib/permix.server.js";
import { PermixHydrate, PermixProvider } from "permix/react";
import { ConfirmDeleteDialog } from "#lib/components/confirm-delete-dialog.js";

const getSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    return session;
});

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    permix: Permix<PermissionsDefinition>;
}>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            { title: "gurkz.me" },
        ],
    }),
    beforeLoad: async ({ context }) => {
        const state = await getPermixState();

        context.permix.hydrate(state);

        return { state };
    },
    loader: async () => getSession(),
    component: RootComponent,
});

function RootComponent() {
    const ssrSession = Route.useLoaderData();
    const { permix, state } = Route.useRouteContext();
    const { data: session } = authClient.useSession();

    useLayoutEffect(() => {
        const currentUser = session?.user ?? ssrSession?.user;
        if (currentUser) {
            // @ts-expect-error its fine
            permix.setup(getRules(currentUser));
        }
    }, [permix, session, ssrSession]);

    return (
        <PermixProvider permix={permix}>
            <PermixHydrate state={state}>
                <RootDocument>
                    <Outlet />

                    <ConfirmDeleteDialog />
                </RootDocument>
            </PermixHydrate>
        </PermixProvider>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html className="dark cc--darkmode">
            <head>
                <HeadContent />
                {import.meta.env.DEV && (
                    <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
                )}
            </head>
            <body className="flex min-h-screen flex-col">
                <div className="min-h-screen bg-gray-950">
                    <Navbar />

                    <main className="mt-20 grow px-4 pt-2">{children}</main>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
