import { For, Match, Switch } from "solid-js";
import { Show } from "solid-js";
import { trpc } from "~/lib/trpc/client";
import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { type IdFormat, idFormat, setIdFormat } from "../lib/music/id-format";
import { MusicList } from "~/components/music/music-list";
import { CreateMusicCard } from "~/components/music/create-card";
import { MusicCardSkeleton } from "~/components/music/music-card";
import { IdFormatToggle } from "~/components/music/id-format";

export default function MusicIdList() {
	const infinite = trpc.music.getInfiniteMusicIds.createInfiniteQuery(
		() => ({
			limit: 15,
		}),
		() => ({
			initialPageParam: undefined, //? shockingly, that works
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),
	);
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<>
			<h2 class="text-2xl">music id list</h2>

			<Show when={user()?.permissions.includes("CREATE_MUSIC_IDS")}>
				<CreateMusicCard />
			</Show>

			<IdFormatToggle />

			<Show
				when={!infinite.isPending}
				fallback={
					<>
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
					</>
				}
			>
				<>
					<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
						<For
							each={infinite.data?.pages}
							fallback={<p>no music ids have been created yet.</p>}
						>
							{(page) => <MusicList data={page.data} />}
						</For>
					</div>
				</>
			</Show>

			<div class="pt-2">
				<Switch fallback={<p>nothing more to load</p>}>
					<Match when={infinite.hasNextPage}>
						<Button onClick={() => infinite.fetchNextPage()}>fetch more</Button>
					</Match>
					<Match when={infinite.isFetching}>
						<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
						</div>
					</Match>
				</Switch>
			</div>
		</>
	);
}
