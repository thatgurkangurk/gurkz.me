import { Nav } from "./nav";
import {
    ColorModeProvider,
    ColorModeScript,
    cookieStorageManagerSSR,
} from "@kobalte/core";
import { SessionProvider } from "@solid-mediakit/auth/client";
import { MetaProvider, Title } from "@solidjs/meta";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Show, Suspense, type ParentProps } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";

function getServerCookies() {
    "use server";
    const colourMode = getCookie("kb-color-mode");
    return colourMode ? `kb-color-mode=${colourMode}` : "";
}

export function Layout(props: ParentProps) {
    const queryClient = new QueryClient();
    const storageManager = cookieStorageManagerSSR(
        isServer ? getServerCookies() : document.cookie
    );

    return (
        <MetaProvider>
            <Title>gurkan's website</Title>
            <ColorModeScript storageType={storageManager.type} />
            <Suspense>
                <SessionProvider>
                    <QueryClientProvider client={queryClient}>
                        <ColorModeProvider>
                            <div class="flex flex-col min-h-screen">
                                <Show when={process.env.IS_PREVIEW === "1"}>
                                    <div class="w-full text-white bg-orange-500">
                                        <p>
                                            this is a preview deployment - go to
                                            the main deployment{" "}
                                            <a
                                                class="underline underline-offset-4"
                                                href="https://www.gurkz.me/"
                                            >
                                                here
                                            </a>
                                        </p>
                                    </div>
                                </Show>
                                <Nav
                                    links={[
                                        {
                                            href: "/",
                                            text: "gurkan's website",
                                            alwaysActive: true,
                                        },
                                        {
                                            href: "/",
                                            text: "home",
                                        },
                                        {
                                            href: "/projects",
                                            text: "projects",
                                        },
                                        {
                                            href: "/music",
                                            text: "music id list",
                                        },
                                    ]}
                                />
                                <div class="flex-grow min-h-[83dvh] w-full flex flex-col">
                                    <main class="flex-grow p-2">
                                        {props.children}
                                    </main>
                                </div>
                            </div>
                            <script
                                defer
                                data-site-id="www.gurkz.me"
                                src="https://assets.onedollarstats.com/tracker.js"
                            />
                            <SolidQueryDevtools initialIsOpen={false} />
                        </ColorModeProvider>
                    </QueryClientProvider>
                </SessionProvider>
            </Suspense>
        </MetaProvider>
    );
}
