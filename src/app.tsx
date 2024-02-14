import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import "./app.css";
import { getRequestEvent, isServer } from "solid-js/web";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Layout } from "./components/layout";
import "@fontsource/geist-mono";
import { Toaster } from "./components/ui/toast";
import { UmamiProvider } from "~/lib/umami";

export default function App() {
  const event = getRequestEvent();

  const storageManager = cookieStorageManagerSSR(
    isServer ? event?.request.headers.get("cookie") ?? "" : document.cookie
  );

  return (
    <Router
      root={(props) => (
        <>
          <ColorModeScript
            initialColorMode="dark"
            storageType={storageManager.type}
          />
          <Suspense>
            <ColorModeProvider storageManager={storageManager}>
              <UmamiProvider>
                <Layout>{props.children}</Layout>
              </UmamiProvider>
              <Toaster />
            </ColorModeProvider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
