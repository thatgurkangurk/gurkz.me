import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import { Layout } from "~/lib/components/layout";
import "@fontsource-variable/space-grotesk";
import "~/lib/styles.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>
          <Layout>{props.children}</Layout>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
