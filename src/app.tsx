import "@fontsource-variable/space-grotesk";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Layout } from "~/lib/components/layout";
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
