import { useEffect } from "react";
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
import { type PermissionsDefinition } from "#lib/permix.js";
import { type Permix } from "permix";
import { getPermixState } from "#lib/permix.server.js";
import { ConfirmDeleteDialog } from "#lib/components/confirm-delete-dialog.js";
import { Providers } from "#lib/components/providers.js";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { run } from "#lib/cookie-consent.js";
import { getInitialPreferences, preferencesAtom } from "#lib/preferences.js";
import { AtomsHydrator } from "#lib/components/atoms-hydrator.js";
import { Provider } from "jotai";

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
    loader: async () => {
        const preferences = getInitialPreferences();
        const session = await getSession();

        return { session, preferences };
    },
    component: RootComponent,
});

function RootComponent() {
    const { permix, state } = Route.useRouteContext();
    const { data: session } = authClient.useSession();
    const { preferences } = Route.useLoaderData();

    return (
        // @ts-expect-error its FINE.
        <Providers permix={permix} state={state} session={session ?? null}>
            <AtomsHydrator atomValues={[[preferencesAtom, preferences]]}>
                <RootDocument>
                    <Outlet />

                    <ConfirmDeleteDialog />
                </RootDocument>
            </AtomsHydrator>
        </Providers>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        run({
            language: { default: "en", translations: { en: "/en.json" } },
            autoClearCookies: true,
            categories: {
                preferences: {
                    enabled: true,
                    autoClear: {
                        cookies: [
                            { name: "id_format" },
                            { name: "better-auth.last_used_login_method" },
                            { name: "user_preferences" },
                        ],
                    },
                },
            },
        });
    }, []);

    return (
        <html lang="en" className="dark cc--darkmode" suppressHydrationWarning>
            <head>
                <HeadContent />
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
