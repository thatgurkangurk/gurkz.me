import { For, createSignal } from "solid-js";
import { NavLink } from "./NavLink";
import { Sheet, SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-solid";

export type Link = {
  href: string;
  text: string;
  alwaysActive?: boolean;
};

type NavbarProps = {
  links: Link[];
  currentPath: string;
};

function Navbar(props: NavbarProps) {
  const [sheetOpen, setSheetOpen] = createSignal(false);
  return (
    <header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]">
      <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <For each={props.links}>
          {(link) => (
            <NavLink
              href={link.href}
              alwaysActive={link.alwaysActive}
              currentPathname={props.currentPath}
            >
              {link.text}
            </NavLink>
          )}
        </For>
      </nav>
      <Sheet
        open={sheetOpen()}
        onOpenChange={(open) => {
          setSheetOpen(open);
        }}
      >
        <Button
          variant={"outline"}
          size={"icon"}
          class="shrink-0 md:hidden"
          onClick={() => setSheetOpen(true)}
        >
          <Menu class="h-5 w-5" />
          <span class="sr-only">toggle navigation menu</span>
        </Button>
        <SheetContent side="bottom">
          <nav class="grid gap-6 text-lg font-medium">
            <For each={props.links}>
              {(link) => (
                <NavLink
                  href={link.href}
                  alwaysActive={link.alwaysActive}
                  currentPathname={props.currentPath}
                  onClick={() => setSheetOpen(false)}
                >
                  {link.text}
                </NavLink>
              )}
            </For>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export { Navbar };
