import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { ErrorBoundary, Match, Suspense, Switch } from "solid-js";
import "./app.css";
import { getRequestEvent, isServer } from "solid-js/web";
import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { Layout } from "./components/layout";
import "@fontsource/geist-mono";
import { Toaster } from "./components/ui/toast";
import { Analytics } from "@gurkz/solid-analytics";
import { queryClient } from "./lib/api";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { trpc } from "./lib/api";

export default function App() {
	const event = getRequestEvent();

	const storageManager = cookieStorageManagerSSR(
		isServer ? event?.request.headers.get("cookie") ?? "" : document.cookie,
	);

	return (
		<Router
			root={(props) => (
				<>
					<ColorModeScript initialColorMode="dark" storageType={storageManager.type} />
					<Suspense>
						<ErrorBoundary fallback={<p>uh oh, something went wrong</p>}>
							<QueryClientProvider client={queryClient}>
								<trpc.Provider queryClient={queryClient}>
									<ColorModeProvider storageManager={storageManager}>
										<Switch fallback={<Layout>{props.children}</Layout>}>
											<Match when={process.env.PROD}>
												<Analytics
													websiteId={process.env.WEBSITE_ID!}
													hostUrl="https://umami.gurkz.me"
												>
													<Layout>{props.children}</Layout>
												</Analytics>
											</Match>
										</Switch>

										<Toaster />
										<SolidQueryDevtools />
									</ColorModeProvider>
								</trpc.Provider>
							</QueryClientProvider>
						</ErrorBoundary>
					</Suspense>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
