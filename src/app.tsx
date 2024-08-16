import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "@fontsource-variable/space-grotesk";
import "./app.css";
import {
	ColorModeProvider,
	ColorModeScript,
	cookieStorageManagerSSR,
} from "@kobalte/core";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { Nav } from "./components/nav";
import { Toaster } from "./components/ui/sonner";
import { queryClient, trpc } from "./lib/trpc/client";
import { Footer } from "./components/footer";

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
										<div class="flex flex-col min-h-screen">
											<Nav />
											<div class="flex-grow min-h-[83dvh] w-full flex flex-col">
												<main class="p-2 flex-grow">{props.children}</main>
											</div>
											<Footer />
										</div>

										{process.env.NODE_ENV === "production" && (
											<script
												defer
												src="https://analytics.gurkz.me/script.js"
												data-website-id="3043940f-d9c8-4ed2-abf4-5efbe527d701"
											/>
										)}
										<Toaster />
										<SolidQueryDevtools />
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
