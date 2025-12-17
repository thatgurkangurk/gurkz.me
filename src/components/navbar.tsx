import { UserButton } from "@daveyplate/better-auth-ui";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { MobileNavLink } from "~/components/mobile-nav-link";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";

type HeaderProps = {
  children: ReactNode;
  sheetPosition?: "left" | "right" | "top" | "bottom";
};

export function Header({
  children,
  sheetPosition = "left",
}: Readonly<HeaderProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = Array.isArray(children) ? children : [children];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white dark:bg-black/95 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-black dark:text-white font-bold text-lg tracking-wide">
                gurkan's website
              </span>
            </Link>

            <div className="flex items-center gap-8">{children}</div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserButton size={"icon"} />
            </div>
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="bg-white dark:bg-black/95 backdrop-blur-sm rounded-full px-4 py-3 border border-gray-200 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={sheetPosition}
                className="bg-white dark:bg-black/98 backdrop-blur-md border-gray-200 dark:border-white/10 w-[300px] p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-white/10">
                    <Link
                      to="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-black dark:text-white font-bold text-base tracking-wide">
                        gurkan's website
                      </span>
                    </Link>
                  </div>

                  <div className="flex flex-col py-6 gap-1">
                    {navLinks.map((child, index) => {
                      if (
                        child &&
                        typeof child === "object" &&
                        "props" in child
                      ) {
                        const { label, to } = child.props;
                        return (
                          <MobileNavLink
                            key={`${to}-${
                              // biome-ignore lint/suspicious/noArrayIndexKey: its fine
                              index
                            }`}
                            label={label}
                            to={to}
                            onClick={() => setIsOpen(false)}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <span className="text-black dark:text-white font-bold text-base tracking-wide">
                gurkan's website
              </span>
            </Link>

            <div className="flex flex-gap items-center gap-2">
              <ModeToggle />
              <UserButton size={"icon"} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
