import type { ReactNode } from "react";
import {
    Outlet,
    createRootRouteWithContext,
    HeadContent,
    Scripts,
    Link,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import "../styles.css";
import { Navbar } from "#lib/components/navbar.js";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "gurkz.me",
            },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
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
            </head>
            <body className="flex min-h-screen flex-col">
                <div className="min-h-screen bg-gray-950">
                    <Navbar />

                    <main className="mt-20 grow px-4 pt-2">{children}</main>
                </div>
                {children}
                <Scripts />
            </body>
        </html>
    );
}
