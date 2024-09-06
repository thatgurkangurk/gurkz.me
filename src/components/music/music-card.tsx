import { createAsync } from "@solidjs/router";
import { LoaderCircle } from "lucide-solid";
import { Show } from "solid-js";
import { toast } from "solid-sonner";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { getFormattedId } from "~/lib/music/id-format";
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
import { useQueryClient } from "@tanstack/solid-query";
import { useMusicContext } from "~/lib/music/context";

function DeleteButton(props: { id: string }) {
	const queryClient = useQueryClient();
	const mutation = trpc.music.deleteMusicId.createMutation(() => ({
		onSuccess: () => {
			toast.success("successfully deleted the music id");
			if (window.umami) {
				window.umami.track("music-id-create");
			}
			queryClient.refetchQueries({
				queryKey: [["music", "getInfiniteMusicIds"]],
			});
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

export function MusicCard(props: {
	musicId: string;
}) {
	const user = createAsync(() => getAuthenticatedUser());
	const query = trpc.music.getMusicId.createQuery(() => ({
		id: props.musicId,
	}));
	const { idFormat } = useMusicContext();

	return (
		<Show when={!query.isLoading} fallback={<MusicCardSkeleton />}>
			<Card class="w-full h-full">
				<CardHeader>
					<CardTitle class="text-xl">{query.data?.name}</CardTitle>
				</CardHeader>
				<CardContent class="flex items-center text-xl">
					<span>
						{getFormattedId(query.data?.robloxId ?? "invalid id", idFormat())}
					</span>
					<CopyButton
						content={`${idFormat() === "TRAITOR_TOWN" ? `s/${query.data?.robloxId}` : query.data?.robloxId}`}
					/>
				</CardContent>
				<CardFooter class="grid gap-1 grid-cols-1">
					<p>created by:</p>
					<div class="flex gap-2 items-center">
						<ImageRoot fallbackDelay={600} class="h-10 w-10">
							<Image src={query.data?.creator.profilePictureUrl} />
							<ImageFallback>
								{query.data?.creator.username[0].toUpperCase()}
							</ImageFallback>
						</ImageRoot>
						<span>{query.data?.creator.username}</span>
						<Show
							when={
								user()?.permissions.includes("MANAGE_MUSIC_IDS") ||
								user()?.id === query.data?.createdById
							}
						>
							<DeleteButton id={query.data?.id ?? "invalid id"} />
						</Show>
					</div>
				</CardFooter>
			</Card>
		</Show>
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
