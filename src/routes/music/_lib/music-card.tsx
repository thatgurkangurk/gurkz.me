import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { MusicId } from "~/lib/schema/music";
import { FormattedId } from "./formatted-id";
import { For, Show } from "solid-js";
import { Badge } from "~/components/ui/badge";

export function MusicCard(props: { musicId: MusicId }) {
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl">{props.musicId.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex items-center text-xl">
					<FormattedId musicId={props.musicId} />
				</div>
				<Show when={props.musicId.tags}>
					<div class="grid grid-cols-2 gap-2">
						<For each={props.musicId.tags}>{(tag) => <Badge variant={"outline"}>{tag}</Badge>}</For>
					</div>
				</Show>
			</CardContent>
			<CardFooter class="grid gap-1 grid-cols-1">
				<p>
					created by <span>{props.musicId.creator.name}</span>
				</p>
			</CardFooter>
		</Card>
	);
}
