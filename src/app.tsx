import "./styles/app.css";
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { isServer } from "solid-js/web";

if (isServer) {
	await import("~/lib/orpc.server");
}

export default function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				experimental_prefetchInRender: true
			}
		}
	});
	return (
		<Router
			root={(props) => (
				<Suspense>
					<QueryClientProvider client={queryClient}>
						{props.children}
						<SolidQueryDevtools />
					</QueryClientProvider>
				</Suspense>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
