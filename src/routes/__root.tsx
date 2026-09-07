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
import { Providers } from "#lib/components/providers.js";

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
    loader: async () => await getSession(),
    component: RootComponent,
});

function RootComponent() {
    const { permix, state } = Route.useRouteContext();
    const { data: session } = authClient.useSession();

    return (
        // @ts-expect-error its FINE.
        <Providers permix={permix} state={state} session={session ?? null}>
            <RootDocument>
                <Outlet />

                <ConfirmDeleteDialog />
            </RootDocument>
        </Providers>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html className="dark cc--darkmode" suppressHydrationWarning>
            <head>
                <HeadContent />
                {import.meta.env.DEV && (
                    <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
                )}
            </head>
            <body
                className="flex min-h-screen flex-col"
                suppressHydrationWarning
            >
                <div className="min-h-screen bg-gray-950">
                    <Navbar />

                    <main className="mt-20 grow px-4 pt-2">{children}</main>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
