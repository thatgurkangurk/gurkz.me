import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { IconMenu2, IconX, IconUser } from "@tabler/icons-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#lib/components/ui/popover.js";
import { buttonVariants } from "#lib/components/ui/button.js";
import { cn } from "#lib/utils.js";

const NAV_LINKS = [
    { label: "home", to: "/" },
    { label: "music id list", to: "/music" },
] as const;

function UserMenuPlaceholder() {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className={buttonVariants({
                    size: "icon",
                    variant: "secondary",
                    className:
                        "size-8 cursor-not-allowed rounded-full text-black dark:text-white",
                })}
            >
                <IconUser size={18} />
            </PopoverTrigger>
            <PopoverContent
                className="w-auto rounded-full px-3 py-1.5 shadow-md"
                align="end"
                sideOffset={8}
            >
                <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    will be added soon
                </p>
            </PopoverContent>
        </Popover>
    );
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement>(null);

    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                isOpen &&
                mobileNavRef.current &&
                !mobileNavRef.current.contains(e.target as Node)
            ) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    const renderLinks = (mobile = false) =>
        NAV_LINKS.map(({ label, to }) => (
            <Link
                key={to}
                to={to}
                onClick={mobile ? closeMenu : undefined}
                className={
                    mobile
                        ? "block rounded-lg px-4 py-2.5 text-base transition-colors duration-150"
                        : "transition-colors duration-150"
                }
                activeProps={{
                    className: mobile
                        ? "bg-gray-100 font-medium text-primary dark:bg-white/10"
                        : "font-medium text-primary",
                }}
                inactiveProps={{
                    className: mobile
                        ? "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-white/90 dark:hover:bg-white/5 dark:hover:text-white"
                        : "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white",
                }}
            >
                {label}
            </Link>
        ));

    return (
        <>
            <nav className="fixed top-4 left-1/2 z-50 hidden w-[90%] max-w-5xl -translate-x-1/2 md:block">
                <div className="rounded-full border border-gray-200 bg-white/95 px-6 py-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/95">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            className="text-lg font-bold tracking-wide text-black dark:text-white"
                        >
                            gurkan's website
                        </Link>
                        <div className="flex items-center gap-8">
                            {renderLinks()}
                        </div>
                        <UserMenuPlaceholder />
                    </div>
                </div>
            </nav>

            <nav
                ref={mobileNavRef}
                className="fixed top-4 right-4 left-4 z-50 md:hidden"
            >
                <div className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/95">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu-dropdown"
                            aria-label="toggle navigation menu"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "h-9 w-9 rounded-full bg-gray-100 text-black transition-transform duration-200 hover:bg-gray-200 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
                            )}
                        >
                            {isOpen ? (
                                <IconX size={20} />
                            ) : (
                                <IconMenu2 size={20} />
                            )}
                        </button>

                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="text-base font-bold tracking-wide text-black dark:text-white"
                        >
                            gurkan's website
                        </Link>

                        <UserMenuPlaceholder />
                    </div>

                    <div
                        id="mobile-menu-dropdown"
                        className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-250 ease-out",
                            isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="mt-3 flex flex-col gap-1 border-t border-gray-200 pt-3 dark:border-white/10">
                                {renderLinks(true)}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
