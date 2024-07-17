import { A, useLocation } from "@solidjs/router";
import { Menu } from "lucide-solid";
import { createSignal, For } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import { Sheet, SheetContent } from "~/lib/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";

type Link = {
  text: string;
  href: string;
  alwaysActive?: boolean;
};

type LinkProps = {
  onClick?: () => void;
} & Link;

const links: Link[] = [
  {
    href: "/",
    text: "gurkan's website",
    alwaysActive: true,
  },
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/blog",
    text: "Blog",
  },
  {
    href: "/projects",
    text: "Projects",
  },
  {
    href: "/music",
    text: "Music IDs",
  },
];

function Link(props: LinkProps) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname || props.alwaysActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";

  return (
    <A
      class={`flex items-center gap-2 font-semibold ${active(props.href)}`}
      onClick={props.onClick}
      href={props.href}
    >
      {props.text}
    </A>
  );
}

export function Nav() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = createSignal(false);

  return (
    <header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]">
      <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6">
        <For each={links}>
          {(link) => (
            <Link
              href={link.href}
              alwaysActive={link.alwaysActive}
              text={link.text}
            />
          )}
        </For>
      </nav>
      <Sheet open={sheetOpen()} onOpenChange={(open) => setSheetOpen(open)}>
        <Button
          variant={"outline"}
          size={"icon"}
          class="shrink-0 md:hidden"
          onClick={() => setSheetOpen(true)}
        >
          <Menu class="h-5 w-5" />
          <span class="sr-only">toggle navigation menu</span>
        </Button>
        <SheetContent>
          <nav class="grid gap-6 text-lg font-medium">
            <For each={links}>
              {(link) => (
                <Link
                  text={link.text}
                  href={link.href}
                  alwaysActive={link.alwaysActive}
                  onClick={() => setSheetOpen(false)}
                />
              )}
            </For>
          </nav>
        </SheetContent>
      </Sheet>
      <div class="ml-auto flex-1 sm:flex-initial"></div>
      <div class="flex flex-row items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
