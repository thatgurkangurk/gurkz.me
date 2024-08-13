import { cache, createAsync, revalidate } from "@solidjs/router";
import { LoaderCircle } from "lucide-solid";
import { Show, Suspense, createSignal } from "solid-js";
import { toast } from "solid-sonner";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import type { MusicId } from "~/lib/music";
import { getFormattedId, idFormat } from "~/lib/music/id-format";
import { trpc } from "~/lib/trpc/client";
import { CopyButton } from "../copy-button";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Image, ImageFallback, ImageRoot } from "../ui/image";
import { Skeleton } from "../ui/skeleton";

const idIsAvailable = cache(async (id: number) => {
	"use server";
	const res = await fetch(`https://api.hyra.io/audio/${id}`);

	// unavailable for legal reasons
	if (res.status === 451) {
		return {
			available: false,
			message: "sorry, this cannot be played due to rights issues.",
		};
	}

	if (res.status !== 200) {
		return {
			available: false,
			message: "sorry, this music id is unavailable.",
		};
	}

	return {
		available: true,
	};
}, "is_available");

function AudioPlayer(props: { musicId: MusicId }) {
	const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
	const isAvailable = createAsync(() => idIsAvailable(props.musicId.robloxId));

	let audio: HTMLAudioElement;

	return (
		<>
			<Show
				when={isAvailable()?.available}
				fallback={<p class="text-destructive">{isAvailable()?.message}</p>}
			>
				{/* biome-ignore lint/a11y/useMediaCaption: roblox doesn't provide captions for audio */}
				<audio
					src={`https://api.hyra.io/audio/${props.musicId.robloxId}`}
					onPlay={() => {
						setIsPlaying(true);
					}}
					onPause={() => {
						setIsPlaying(false);
					}}
					// biome-ignore lint/style/noNonNullAssertion: it is safe
					ref={audio!}
				/>
			</Show>

			<Button
				disabled={!isAvailable()?.available}
				onClick={() => {
					if (!audio) return;
					if (isPlaying()) {
						audio.pause();
						audio.currentTime = 0;
						return;
					}

					audio.currentTime = 0;
					audio.play();
				}}
			>
				{isPlaying() ? "pause" : "play"}
			</Button>
		</>
	);
}

function DeleteButton(props: { id: string }) {
	const mutation = trpc.music.deleteMusicId.createMutation(() => ({
		onSuccess: () => {
			toast.success("successfully deleted the music id");
			revalidate("music_ids");
		},
	}));

	return (
		<Button
			onClick={() =>
				mutation.mutate({
					id: props.id,
				})
			}
			disabled={mutation.isPending}
			variant={"destructive"}
		>
			<Show when={mutation.isPending}>
				<LoaderCircle class="h-6 w-6 animate-spin" />
			</Show>{" "}
			delete
		</Button>
	);
}

export function MusicCard(props: { musicId: MusicId }) {
	const user = createAsync(() => getAuthenticatedUser());
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl">{props.musicId.name}</CardTitle>
			</CardHeader>
			<CardContent class="flex items-center text-xl">
				<span>{getFormattedId(props.musicId.robloxId, idFormat())}</span>
				<CopyButton
					content={`${idFormat() === "TRAITOR_TOWN" ? `s/${props.musicId.robloxId}` : props.musicId.robloxId}`}
				/>
			</CardContent>
			<CardFooter class="grid gap-1 grid-cols-1">
				<Suspense
					fallback={
						<Button disabled>
							<LoaderCircle class="h-6 w-6 animate-spin" /> loading music
							player...
						</Button>
					}
				>
					<AudioPlayer musicId={props.musicId} />
				</Suspense>
				<p>created by:</p>
				<div class="flex gap-2 items-center">
					<ImageRoot fallbackDelay={600} class="h-10 w-10">
						<Image src={props.musicId.creator.profilePictureUrl} />
						<ImageFallback>
							{props.musicId.creator.username[0].toUpperCase()}
						</ImageFallback>
					</ImageRoot>
					<span>{props.musicId.creator.username}</span>
					<Show
						when={
							user()?.permissions.includes("MANAGE_MUSIC_IDS") ||
							user()?.id === props.musicId.createdById
						}
					>
						<DeleteButton id={props.musicId.id} />
					</Show>
				</div>
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
