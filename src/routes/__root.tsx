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
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                <nav
                    style={{ display: "flex", gap: "16px", padding: "12px 0" }}
                >
                    <Link
                        to="/"
                        style={{ color: "#333", textDecoration: "none" }}
                        activeProps={{
                            style: {
                                textDecoration: "underline",
                                fontWeight: "bold",
                            },
                        }}
                    >
                        home
                    </Link>
                    <Link
                        to="/music"
                        style={{ color: "#333", textDecoration: "none" }}
                        activeProps={{
                            style: {
                                textDecoration: "underline",
                                fontWeight: "bold",
                            },
                        }}
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
