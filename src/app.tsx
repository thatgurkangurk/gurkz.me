import "./styles/app.css";
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { isServer } from "solid-js/web";
import { Nav } from "./components/nav";
import { getCookie } from "vinxi/http";

if (isServer) {
	await import("~/lib/orpc.server");
}

function getServerCookies() {
	"use server";
	const colorMode = getCookie("kb-color-mode");
	return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
	const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie);
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
						<ColorModeScript storageType={storageManager.type} />
						<ColorModeProvider storageManager={storageManager}>
							<div class="bg-amber-500 p-2">
								<h3>hello</h3>
								<p>i'm restructuring a bit so the website will be a bit bare-bones for a while</p>
							</div>
							<Nav />
							{props.children}
							<SolidQueryDevtools />
						</ColorModeProvider>
					</QueryClientProvider>
				</Suspense>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
