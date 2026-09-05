import type { ReactNode } from "react";
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

const getSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    return session;
});

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
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
    loader: async () => getSession(),
    component: RootComponent,
});

function RootComponent() {
    const session = Route.useLoaderData();

    authClient.hydrateSession(session);

    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
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
