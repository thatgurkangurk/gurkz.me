/// <reference types="vite/client" />
import { StrictMode, useEffect, type ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  Link,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import globalCss from "../styles/global.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Devtools } from "~/components/devtools";
import { themeScript, useSyncThemeClass } from "~/lib/theme";
import { Provider } from "jotai";
import { Header, NavLink } from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
import { PermixProvider } from "permix/react";
import { getRules, permix } from "~/lib/permix";
import { getServerSession, useSession } from "~/lib/session";
import { createServerFn } from "@tanstack/react-start";
import { Providers } from "~/components/providers";

const getPermixRules = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getServerSession();

  permix.setup(getRules(session));

  return {
    state: permix.dehydrate(),
    session: session,
  };
});

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
        title: "gurkan's website",
      },
    ],
    scripts: [
      {
        id: "theme-script",
        children: themeScript,
      },
    ],
    links: [{ rel: "stylesheet", href: globalCss }],
  }),
  component: RootComponent,
  loader: () => getPermixRules(),
});

function RootComponent() {
  const { state, session } = Route.useLoaderData();
  const { data } = useSession();

  useEffect(() => {
    permix.hydrate(state);
    const rules = getRules(session);
    permix.setup(rules);
  }, []);

  useEffect(() => {
    if (data) {
      const rules = getRules(data);
      permix.setup(rules);
    }
  }, [data]);

  return (
    <Provider>
      <Providers>
        <PermixProvider permix={permix}>
          <RootDocument>
            <Outlet />
            <Devtools />
          </RootDocument>
        </PermixProvider>
      </Providers>
    </Provider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { data } = useSession();
  useSyncThemeClass();
  return (
    <StrictMode>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body>
          <Toaster />
          <Header sheetPosition="left">
            <NavLink label="home" to="/" />
            <NavLink label="music id list" to="/music" />
            {data?.user.role === "admin" && (
              <NavLink label="admin" to="/admin" />
            )}
          </Header>
          <main className="p-2">{children}</main>
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
