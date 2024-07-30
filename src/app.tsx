import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "@fontsource-variable/space-grotesk";
import "./app.css";
import { getCookie } from "vinxi/http";
import {
	ColorModeProvider,
	ColorModeScript,
	cookieStorageManagerSSR,
} from "@kobalte/core";
import { isServer } from "solid-js/web";
import { Nav } from "./components/nav";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient, trpc } from "./lib/trpc/client";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Toaster } from "./components/ui/toast";

function getServerCookies() {
	"use server";

	const colorMode = getCookie("kb-color-mode");
	return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
	const storageManager = cookieStorageManagerSSR(
		isServer ? getServerCookies() : document.cookie,
	);

	return (
		<Router
			root={(props) => (
				<>
					<ColorModeScript storageType={storageManager.type} />
					<ColorModeProvider storageManager={storageManager}>
						<MetaProvider>
							<Title>gurkan's website</Title>

							<Suspense>
								<QueryClientProvider client={queryClient}>
									<trpc.Provider queryClient={queryClient}>
										<Nav />
										<div class="min-h-[93dvh] w-full flex flex-col">
											<main class="p-2 flex-grow">{props.children}</main>
										</div>
										<SolidQueryDevtools />
										<Toaster />
									</trpc.Provider>
								</QueryClientProvider>
							</Suspense>
						</MetaProvider>
					</ColorModeProvider>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
