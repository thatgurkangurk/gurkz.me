/// <reference types="vite/client" />
import { type ReactNode } from "react";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import appCss from "@/styles/app.css?url";
import { useSyncThemeClass } from "@/hooks/useThemeSync";
import { themeScript } from "@/lib/theme";
import { Header } from "@/components/header";
import { Provider } from "jotai";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { orpc } from "@/lib/orpc";
import { Partytown } from "@qwik.dev/partytown/react";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
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
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(orpc.session.get.queryOptions()),
  onError: (err) => {
    console.error(err);
  },
  errorComponent: (ctx) => {
    return <p>error: {ctx.error.message}</p>;
  },
});

function RootComponent() {
  return (
    <Provider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </Provider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  useSyncThemeClass();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Partytown />
        <script
          suppressHydrationWarning
          type="text/partytown"
          defer
          src="/api/stonks.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <Header
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
        <main className="p-2">{children}</main>
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
