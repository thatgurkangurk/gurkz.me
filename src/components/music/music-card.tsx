import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { FormattedId } from "./formatted-id";
import type { MusicId } from "~/lib/music";

export function MusicCard(props: { musicId: MusicId }) {
    return (
        <Card class="w-full h-full">
            <CardHeader>
                <CardTitle class="text-xl">{props.musicId.name}</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center text-xl">
                <FormattedId id={props.musicId.robloxId} />
            </CardContent>
            <CardFooter class="grid gap-1 grid-cols-1">
                <p>created by {props.musicId.creator.name}</p>
            </CardFooter>
        </Card>
    );
}
