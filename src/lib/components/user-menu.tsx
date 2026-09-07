import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "#lib/components/ui/dropdown-menu.js";
import { Skeleton } from "#lib/components/ui/skeleton.js";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "#lib/components/ui/avatar.js";
import { buttonVariants } from "#lib/components/ui/button.js";
import { authClient } from "#lib/auth.js";
import {
    IconLogout,
    IconBrandDiscord,
    IconUser,
    IconSettings,
} from "@tabler/icons-react";

export function UserMenu() {
    const [mounted, setMounted] = useState(false);
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDiscordSignIn = async () => {
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: "/",
        });
    };

    if (!mounted || isPending) {
        return <Skeleton className="size-8 rounded-xl" />;
    }

    const username = session?.user?.username;
    const userInitials = session?.user?.name
        ? session.user.name.slice(0, 2).toUpperCase()
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={buttonVariants({
                    size: "icon",
                    variant: "ghost",
                    className: "size-8 rounded-xl p-0 focus-visible:ring-0",
                })}
            >
                {session ? (
                    <Avatar className="size-8">
                        <AvatarImage
                            src={session.user.image ?? undefined}
                            alt={session.user.name}
                        />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                ) : (
                    <IconUser size={18} />
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="min-w-56 rounded-lg"
                align="end"
                sideOffset={8}
            >
                {session ? (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2.5 px-2 py-1.5 text-start text-sm">
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={
                                                session.user.image ?? undefined
                                            }
                                            alt={session.user.name}
                                        />
                                        <AvatarFallback>
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-start text-sm leading-tight">
                                        <span className="truncate font-bold">
                                            {session.user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground font-normal">
                                            @{username}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                render={<a href="/user" />}
                                className="flex items-center gap-2"
                            >
                                <IconSettings
                                    size={18}
                                    className="text-muted-foreground shrink-0"
                                />
                                <span>user settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => authClient.signOut()}
                                className="flex items-center gap-2"
                            >
                                <IconLogout
                                    size={18}
                                    className="text-muted-foreground shrink-0"
                                />
                                <span>log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                ) : (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2.5 px-2 py-1.5 text-start text-sm">
                                    <IconUser
                                        size={18}
                                        className="text-muted-foreground shrink-0"
                                    />
                                    <div className="grid flex-1 text-start text-sm leading-tight">
                                        <span className="truncate font-bold">
                                            welcome!
                                        </span>
                                        <span className="truncate text-xs opacity-70">
                                            please sign in
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={handleDiscordSignIn}
                                className="flex items-center gap-2"
                            >
                                <IconBrandDiscord
                                    size={18}
                                    className="text-muted-foreground shrink-0"
                                />
                                <span>sign in with discord</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
