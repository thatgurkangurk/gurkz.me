import type { InferSelectModel } from "drizzle-orm";
import type { User } from "lucia";
import { Switch, Match } from "solid-js";
import type { musicIds } from "~/lib/schema/music";
import { idFormat } from "~/lib/music/id-format";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "../ui/card";
import type { MusicId } from "~/lib/music";
import { Skeleton } from "../ui/skeleton";
import { LoaderCircle } from "lucide-solid";
import { CopyButton } from "../copy-button";

export function MusicCard(props: { musicId: MusicId }) {
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl">{props.musicId.name}</CardTitle>
			</CardHeader>
			<CardContent class="flex items-center text-xl">
				<Switch fallback={<p>something went wrong</p>}>
					<Match when={idFormat() === "NORMAL"}>
						<span>{props.musicId.robloxId}</span>
					</Match>
					<Match when={idFormat() === "TRAITOR_TOWN"}>
						<span>s/{props.musicId.robloxId}</span>
					</Match>
				</Switch>
				<CopyButton
					content={`${idFormat() === "TRAITOR_TOWN" ? `s/${props.musicId.robloxId}` : props.musicId.robloxId}`}
				/>
			</CardContent>
			<CardFooter class="grid grid-cols-1">
				<span>created by: {props.musicId.creator.username}</span>
			</CardFooter>
		</Card>
	);
}

export function MusicCardSkeleton() {
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl pt-1">
					<Skeleton class="h-6 w-2 sm:w-48 md:w-48 lg:w-60" />
				</CardTitle>
			</CardHeader>
			<CardContent class="flex items-center text-xl gap-2 pt-3">
				<Skeleton class="h-6 w-2 sm:w-32 md:w-32 lg:w-48" />
				<Skeleton class="h-6 w-6" />
			</CardContent>
			<CardFooter class="grid grid-cols-1 gap-1">
				<Skeleton class="h-10" />
				<Skeleton class="h-6 w-[95%]" />
			</CardFooter>
			<div class="p-2">
				<LoaderCircle class="h-6 w-6 animate-spin" />
			</div>
		</Card>
	);
}
