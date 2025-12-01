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
import { authClient } from "~/lib/auth";
import type { QueryClient } from "@tanstack/react-query";
import { Devtools } from "~/components/devtools";
import { themeScript, useSyncThemeClass } from "~/lib/theme";
import { ModeToggle } from "~/components/mode-toggle";
import { Provider } from "jotai";
import { Header } from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
import { PermixProvider } from "permix/react";
import { getRules, permix } from "~/lib/permix";
import { useSession } from "~/lib/session";

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
});

function RootComponent() {
  const { data } = useSession();

  useEffect(() => {
    if (data) {
      permix.setup(getRules(data));
    }
  }, [data]);

  return (
    <Provider>
      <PermixProvider permix={permix}>
        <RootDocument>
          <Outlet />
          <Devtools />
        </RootDocument>
      </PermixProvider>
    </Provider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  useSyncThemeClass();
  return (
    <StrictMode>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body>
          <Toaster />
          <Header
            sheetPosition="left"
            links={[
              {
                label: "home",
                to: "/",
              },
              {
                label: "music id list",
                to: "/music",
              },
            ]}
          />
          {children}
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
