import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import "./app.css";
import { Layout } from "./lib/components/layout";

export default function App() {
  return (
    <Router root={(props) => <Layout>{props.children}</Layout>}>
      <FileRoutes />
    </Router>
  );
}
