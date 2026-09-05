import { orpc } from "#lib/orpc.js";
import type { MusicIdWithCreator } from "#lib/server/db/schema.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "#lib/components/ui/card.js";
import { buttonVariants } from "#lib/components/ui/button.js";
import { IconExternalLink } from "@tabler/icons-react";
import { cn } from "cn";
import { Badge } from "#lib/components/ui/badge.js";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "#lib/components/ui/avatar.js";

export const Route = createFileRoute("/music")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.query({
            ...orpc.music.list.queryOptions(),
            staleTime: "static",
        });
    },
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
});

function MusicCard({
    musicId,
}: Readonly<{
    musicId: MusicIdWithCreator;
}>) {
    return (
        <Card className="flex h-full w-full flex-col justify-between overflow-hidden">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-lg font-semibold">
                        {musicId.name}
                    </CardTitle>
                    <a
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground",
                        )}
                        href={`https://create.roblox.com/store/asset/${musicId.robloxId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconExternalLink className="h-4 w-4" />
                    </a>
                </div>

                {musicId.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {musicId.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>

            <CardContent className="py-1">
                <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="font-mono text-base font-semibold tracking-wide">
                        {musicId.robloxId}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="flex min-h-14 items-center justify-between border-t px-6 py-2.5">
                <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 border">
                        <AvatarImage
                            src={musicId.creator.image ?? undefined}
                            alt={musicId.creator.name}
                        />
                        <AvatarFallback className="text-[10px]">
                            {musicId.creator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-xs leading-tight">
                        <span className="font-medium text-foreground">
                            {musicId.creator.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {dateFormat.format(musicId.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="flex h-8 items-center">
                    {/* delete button */}
                </div>
            </CardFooter>
        </Card>
    );
}

function RouteComponent() {
    const { data } = useSuspenseQuery(orpc.music.list.queryOptions());
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                music id list
            </h1>

            <div className="grid w-full grid-cols-1 place-items-center gap-4 py-6 transition-opacity duration-300 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                {data.map((item) => (
                    <MusicCard key={item.id} musicId={item} />
                ))}
            </div>
        </>
    );
}
