import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { FormattedId } from "./formatted-id";
import { For, Show } from "solid-js";
import type { MusicId } from "~/lib/music";

export function MusicCard(props: { musicId: MusicId }) {
    return (
        <Card class="w-full h-full">
            <CardHeader>
                <CardTitle class="text-xl">{props.musicId.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="flex items-center text-xl">
                    <FormattedId id={props.musicId.robloxId} />
                </div>
                <Show when={props.musicId.tags}>
                    {(tags) => (
                        <div class="grid grid-cols-2 gap-2">
                            <For each={tags()}>
                                {(tag) => (
                                    <Badge variant={"outline"}>{tag}</Badge>
                                )}
                            </For>
                        </div>
                    )}
                </Show>
            </CardContent>
            <CardFooter class="grid gap-1 grid-cols-1">
                <p>created by {props.musicId.creator.name}</p>
            </CardFooter>
        </Card>
    );
}
