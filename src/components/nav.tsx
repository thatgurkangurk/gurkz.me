import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { useAuth } from "@solid-mediakit/auth/client";
import { A } from "@solidjs/router";
import { Menu } from "lucide-solid";
import { createSignal, For, Show, Suspense } from "solid-js";

type Link = {
    text: string;
    href: string;
    alwaysActive?: boolean;
    onClick?: () => void;
};

function AuthStatus() {
    const auth = useAuth();
    return (
        <Suspense
            fallback={<p class="w-fit whitespace-nowrap">loading auth...</p>}
        >
            <Show
                when={auth.status() === "authenticated" && auth.session()}
                fallback={
                    <Button
                        onClick={() => auth.signIn("discord")}
                        class="whitespace-nowrap"
                        variant="link"
                        type="submit"
                    >
                        log in
                    </Button>
                }
            >
                {(session) => (
                    <>
                        <p class="flex flex-row gap-1">
                            hello, <span>{session().user?.name}</span>
                        </p>

                        <Button
                            onClick={() => auth.signOut()}
                            class="whitespace-nowrap"
                            variant="link"
                            type="submit"
                        >
                            log out
                        </Button>
                    </>
                )}
            </Show>
        </Suspense>
    );
}

function NavLink(props: Link) {
    return (
        <A
            onClick={props.onClick}
            activeClass="text-foreground"
            inactiveClass="text-muted-foreground hover:text-foreground"
            class="flex items-center gap-2 font-semibold"
            href={props.href}
            end={!props.alwaysActive}
        >
            {props.text}
        </A>
    );
}

export function Nav(props: { links: Link[] }) {
    const [sheetOpen, setSheetOpen] = createSignal<boolean>(false);
    const auth = useAuth();

    return (
        <header class="z-50 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]">
            <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6">
                <For each={props.links}>{(link) => <NavLink {...link} />}</For>
                <Show when={auth.status() === "authenticated"}>
                    <Show
                        when={auth
                            .session()
                            ?.user.permissions.includes("CREATE_SHORT_LINKS")}
                    >
                        <NavLink href="/short-links" text="link shortener" />
                    </Show>
                    <Show when={auth.session()?.user.role === "ADMIN"}>
                        <NavLink href="/admin" text="admin" />
                    </Show>
                </Show>
            </nav>

            <Sheet open={sheetOpen()} onOpenChange={setSheetOpen}>
                <Button
                    variant="outline"
                    size="icon"
                    class="shrink-0 md:hidden"
                    onClick={() => {
                        setSheetOpen(() => true);
                    }}
                >
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">toggle navigation menu</span>
                </Button>
                <SheetContent position={"left"}>
                    <nav class="grid gap-6 text-lg font-medium">
                        <For each={props.links}>
                            {(link) => (
                                <NavLink
                                    onClick={() => setSheetOpen(false)}
                                    {...link}
                                />
                            )}
                        </For>
                        <Show when={auth.status() === "authenticated"}>
                            <Show
                                when={auth
                                    .session()
                                    ?.user.permissions.includes(
                                        "CREATE_SHORT_LINKS"
                                    )}
                            >
                                <NavLink
                                    onClick={() => setSheetOpen(false)}
                                    href="/short-links"
                                    text="link shortener"
                                />
                            </Show>
                            <Show when={auth.session()?.user.role === "ADMIN"}>
                                <NavLink
                                    onClick={() => setSheetOpen(false)}
                                    href="/admin"
                                    text="admin"
                                />
                            </Show>
                        </Show>
                    </nav>
                </SheetContent>
            </Sheet>
            <div class="ml-auto flex-1 sm:flex-initial" />
            <div class="flex flex-row items-center gap-2">
                <AuthStatus />
                <ModeToggle />
            </div>
        </header>
    );
}
