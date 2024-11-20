import { useAuth } from "@solid-mediakit/auth/client";
import { createSignal, For, Show } from "solid-js";
import { Sheet, SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-solid";
import { A } from "@solidjs/router";

type Link = {
  text: string;
  href: string;
  alwaysActive?: boolean;
  onClick?: () => void;
};

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
  const auth = useAuth();
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
                <NavLink onClick={() => setSheetOpen(false)} {...link} />
              )}
            </For>
          </nav>
        </SheetContent>
      </Sheet>
      <div class="ml-auto flex-1 sm:flex-initial" />
      <div class="flex flex-row items-center break-normal gap-2">
        <Show when={auth.session()} fallback={<Button onClick={() => auth.signIn("discord")} variant="link">log in</Button>}>
          {(session) => <div class="flex gap-2">
            <p>hello, {session().user.name}</p>
            <Button onClick={() => auth.signOut()} variant="link">log out</Button>
            </div>}
        </Show>
      </div>
    </header>
  );
}