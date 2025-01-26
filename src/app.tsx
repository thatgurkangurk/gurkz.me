import { Layout } from "./components/layout";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "~/styles/app.css";

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
