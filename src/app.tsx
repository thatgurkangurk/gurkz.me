import { Layout } from "./components/layout";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "~/styles/app.css";

export default function App() {
    return (
        <Router root={(props) => <Layout children={props.children} />}>
            <FileRoutes />
        </Router>
    );
}
