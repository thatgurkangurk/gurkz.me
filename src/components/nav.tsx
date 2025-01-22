import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { A, useAction } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { Menu } from "lucide-solid";
import { createSignal, For, Show, Suspense } from "solid-js";
import { useSession } from "~/lib/auth";
import { signOutAction, socialLoginAction } from "~/server/actions/auth";

type Link = {
    text: string;
    href: string;
    alwaysActive?: boolean;
    onClick?: () => void;
};

function AuthStatus() {
    const session = useSession();
    const queryClient = useQueryClient();
    const signOut = useAction(signOutAction);
    return (
        <Suspense
            fallback={<p class="w-fit whitespace-nowrap">loading auth...</p>}
        >
            <Show
                when={session.data}
                fallback={
                    <form method="post" action={socialLoginAction}>
                        <input type="hidden" name="provider" value="discord" />
                        <Button
                            class="whitespace-nowrap"
                            variant="link"
                            type="submit"
                        >
                            log in
                        </Button>
                    </form>
                }
            >
                {(session) => (
                    <>
                        <p class="flex flex-row gap-1">
                            hello, <span>{session().user.name}</span>
                        </p>
                        <form
                            method="post"
                            onSubmit={async (e) => {
                                e.preventDefault();

                                await signOut();
                                await queryClient.invalidateQueries({
                                    queryKey: ["auth", "session"],
                                });
                            }}
                            action={signOutAction}
                        >
                            <Button
                                class="whitespace-nowrap"
                                variant="link"
                                type="submit"
                            >
                                log out
                            </Button>
                        </form>
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
    return (
        <header class="z-50 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]">
            <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6">
                <For each={props.links}>{(link) => <NavLink {...link} />}</For>
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
