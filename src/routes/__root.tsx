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
        <html className="dark">
            <head>
                <HeadContent />
            </head>
            <body className="bg-gray-950 text-gray-100 min-h-screen">
                <nav className="flex gap-4 py-3">
                    <Link
                        to="/"
                        className="text-gray-200 hover:text-white no-underline [&.active]:underline [&.active]:font-bold"
                    >
                        home
                    </Link>
                    <Link
                        to="/music"
                        className="text-gray-200 hover:text-white no-underline [&.active]:underline [&.active]:font-bold"
                    >
                        music id list
                    </Link>
                </nav>
                {children}
                <Scripts />
            </body>
        </html>
    );
}
