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
    const { data: session, isPending } = authClient.useSession();

    const handleDiscordSignIn = async () => {
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: "/",
        });
    };

    if (isPending) {
        return <Skeleton className="size-8 rounded-full" />;
    }

    const username = session?.user?.username;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={buttonVariants({
                    size: "icon",
                    variant: "secondary",
                    className: "size-8 rounded-full text-black dark:text-white",
                })}
            >
                {session ? (
                    <Avatar className="size-8 rounded-full">
                        <AvatarImage
                            src={session.user.image ?? undefined}
                            alt={session.user.name}
                        />
                        <AvatarFallback className="rounded-full">
                            <Skeleton className="size-8 rounded-full" />
                        </AvatarFallback>
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
                                    <Avatar className="size-8 rounded-full shrink-0">
                                        <AvatarImage
                                            src={
                                                session.user.image ?? undefined
                                            }
                                            alt={session.user.name}
                                        />
                                        <AvatarFallback className="rounded-full">
                                            <Skeleton className="size-8 rounded-full" />
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
