import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { IconCookie, IconMenu2, IconX } from "@tabler/icons-react";
import { Button, buttonVariants } from "#lib/components/ui/button.js";
import { cn } from "#lib/utils.js";
import { UserMenu } from "./user-menu";
import { usePermix } from "#lib/util/use-permix.js";
import { showPreferences } from "#lib/cookie-consent.js";

type NavLinkProps = {
    to: string;
    label: string;
    mobile?: boolean;
    onClick?: () => void;
};

function NavLink({ to, label, mobile, onClick }: NavLinkProps) {
    return (
        <Link
            to={to}
            onClick={onClick}
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
    );
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const { check, isReady } = usePermix();

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

    useEffect(() => {
        console.log(isReady);
    }, [isReady]);

    const canAccessMusicIdList = check("musicId.list");

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
                            <NavLink to="/" label="home" />
                            {canAccessMusicIdList && (
                                <NavLink to="/music" label="music id list" />
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                onClick={showPreferences}
                                variant="ghost"
                                size={"icon"}
                            >
                                <IconCookie />
                            </Button>

                            <UserMenu />
                        </div>
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

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                onClick={showPreferences}
                                variant="ghost"
                                size={"icon"}
                            >
                                <IconCookie />
                            </Button>

                            <UserMenu />
                        </div>
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
                                <NavLink
                                    to="/"
                                    label="home"
                                    mobile
                                    onClick={closeMenu}
                                />
                                {canAccessMusicIdList && (
                                    <NavLink
                                        to="/music"
                                        label="music id list"
                                        mobile
                                        onClick={closeMenu}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
