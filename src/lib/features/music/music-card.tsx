import type { MusicIdWithCreator } from "#lib/server/db/schema.js";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "#lib/components/ui/card.js";
import { Button, buttonVariants } from "#lib/components/ui/button.js";
import { IconExternalLink } from "@tabler/icons-react";
import { cn } from "cn";
import { Badge } from "#lib/components/ui/badge.js";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "#lib/components/ui/avatar.js";
import { idFormatAtom, type IdFormat } from "#lib/features/music/state.js";
import { useAtomValue } from "jotai";
import { Check } from "#lib/components/check.js";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
});

function format(robloxId: string, idFormat: IdFormat): string {
    switch (idFormat) {
        case "DEFAULT": {
            return robloxId;
        }
        case "TRAITOR_TOWN": {
            return `s/${robloxId}`;
        }
        default: {
            return robloxId;
        }
    }
}

function FormattedMusicId({ robloxId }: Readonly<{ robloxId: string }>) {
    const idFormat = useAtomValue(idFormatAtom);

    return format(robloxId, idFormat);
}

export function MusicCard({
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
                        {musicId.tags.map((tag, i) => (
                            <Badge
                                key={`${musicId.id}_tag_${i}`}
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
                        <FormattedMusicId robloxId={musicId.robloxId} />
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
                    <Check path="musicId.delete" data={musicId}>
                        <Button variant={"destructive"} disabled>
                            delete (soon)
                        </Button>
                    </Check>
                </div>
            </CardFooter>
        </Card>
    );
}
