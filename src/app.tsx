// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <ColorModeScript storageType={storageManager.type} />
          <Suspense>
            <ColorModeProvider storageManager={storageManager}>
               {props.children}
            </ColorModeProvider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
