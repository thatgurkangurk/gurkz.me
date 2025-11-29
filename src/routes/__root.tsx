/// <reference types="vite/client" />
import { StrictMode, type ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import globalCss from "../styles/global.css?url";

export const Route = createRootRoute({
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
        title: "TanStack Start Starter",
      },
    ],
    links: [{ rel: "stylesheet", href: globalCss }],
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
    <StrictMode>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <nav className="flex flex-row w-full gap-2 bg-orange-400">
            <Link to="/">home</Link>
            <Link to="/music">music id list</Link>
          </nav>
          {children}
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
