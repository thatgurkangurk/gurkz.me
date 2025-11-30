/// <reference types="vite/client" />
import { StrictMode, type ReactNode } from "react";
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
        title: "TanStack Start Starter",
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

function AuthDisplay() {
  const session = authClient.useSession();

  return (
    <>
      {session.data?.user ? (
        <>
          <p>hi, {session.data.user.name}</p>
          <button onClick={() => authClient.signOut()}>log out</button>
        </>
      ) : (
        <>
          <button
            onClick={() =>
              authClient.signIn.social({
                provider: "discord",
              })
            }
          >
            log in
          </button>
        </>
      )}
    </>
  );
}

function RootComponent() {
  return (
    <Provider>
      <RootDocument>
        <Outlet />
        <Devtools />
      </RootDocument>
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
          <nav className="flex flex-row w-full gap-2 bg-orange-400">
            <Link to="/">home</Link>
            <Link to="/music">music id list</Link>
            <AuthDisplay />
            <ModeToggle />
          </nav>
          {children}
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
