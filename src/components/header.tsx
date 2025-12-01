import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import { Link, ValidateRedirectOptions } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { atom, useAtom, useSetAtom } from "jotai";
import { AuthStatus } from "./auth-status";
import { cn } from "~/lib/utils";
import { cva } from "class-variance-authority";
import { ComponentProps, createContext, ReactNode, use } from "react";

type NavLinkType = {
  to: ValidateRedirectOptions["to"];
  label: string;
};

const sheetOpenAtom = atom(false);

const linkVariants = cva(
  "transition-colors duration-200 px-3 py-2 rounded-md text-base",
  {
    variants: {
      variant: {
        sheet: "",
        outside: "",
      },
      state: {
        active: "",
        inactive: "",
      },
    },
    compoundVariants: [
      {
        variant: "sheet",
        state: "active",
        className: "text-primary font-medium bg-primary/10",
      },
      {
        variant: "sheet",
        state: "inactive",
        className: "text-foreground hover:text-primary hover:bg-accent",
      },
      {
        variant: "outside",
        state: "active",
        className: "text-primary font-medium",
      },
      {
        variant: "outside",
        state: "inactive",
        className: "text-muted-foreground hover:text-foreground",
      },
    ],
  }
);

const InSheetContext = createContext(false);

export function NavLink({ label, to }: NavLinkType) {
  const inSheet = use(InSheetContext);
  const setSheetOpen = useSetAtom(sheetOpenAtom);
  const variant = inSheet ? "sheet" : "outside";

  return (
    <Link
      key={`${to}-${label}`}
      to={to}
      onClick={() => inSheet && setSheetOpen(false)}
      activeProps={{
        className: cn(linkVariants({ variant, state: "active" })),
      }}
      inactiveProps={{
        className: cn(linkVariants({ variant, state: "inactive" })),
      }}
    >
      {label}
    </Link>
  );
}

export function Header({
  children,
  sheetPosition = "right",
}: {
  children: ReactNode;
  sheetPosition?: ComponentProps<typeof SheetContent>["side"];
}) {
  const [sheetOpen, setSheetOpen] = useAtom(sheetOpenAtom);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6 supports-[backdrop-filter]:bg-background/60">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-8 md:text-sm lg:gap-10">
        <Link
          to="/"
          className="text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          gurkan's website
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <InSheetContext value={false}>{children}</InSheetContext>
        </div>
      </nav>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-accent md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side={sheetPosition} className="w-[300px] sm:w-[400px]">
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-semibold">
              gurkan's website
            </SheetTitle>
            <nav className="mt-6 flex flex-col gap-4">
              <InSheetContext value={true}>{children}</InSheetContext>
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-2">
        <AuthStatus />
        <ModeToggle />
      </div>
    </header>
  );
}
