import { Nav } from "./nav";
import {
    ColorModeScript,
    cookieStorageManagerSSR,
    ColorModeProvider,
} from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { ParentProps, Show, Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { Toaster } from "~/components/ui/sonner";
import { getColourMode } from "~/lib/colour-mode";

export function Layout(props: ParentProps) {
    const storageManager = cookieStorageManagerSSR(
        isServer ? getColourMode() : document.cookie
    );
    const queryClient = new QueryClient();

    return (
        <MetaProvider>
            <Suspense>
                <QueryClientProvider client={queryClient}>
                    <ColorModeScript storageType={storageManager.type} />

                    <ColorModeProvider storageManager={storageManager}>
                        <div class="flex flex-col min-h-screen">
                            <Show
                                when={import.meta.env.VITE_IS_PREVIEW === "1"}
                            >
                                <div class="w-full text-white bg-orange-500">
                                    <p>
                                        this is a preview deployment - go to the
                                        main deployment{" "}
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
                            <div class="flex-grow min-h-83dvh w-full flex flex-col">
                                <main class="flex-grow p-2">
                                    {props.children}
                                </main>
                            </div>
                        </div>
                        <Toaster />
                    </ColorModeProvider>

                    <SolidQueryDevtools />
                </QueryClientProvider>
            </Suspense>
        </MetaProvider>
    );
}
