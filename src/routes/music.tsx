import { For, Suspense } from "solid-js";
import { Show } from "solid-js";
import { trpc } from "~/lib/trpc/client";
import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { Button } from "~/components/ui/button";
import { MusicList } from "~/components/music/music-list";
import { CreateMusicCard } from "~/components/music/create-card";
import { IdFormatToggle } from "~/components/music/id-format";
import { LoaderCircle } from "lucide-solid";

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

			<Suspense>
				<IdFormatToggle />
			</Suspense>

			<Suspense>
				<Show
					when={!infinite.isPending}
					fallback={<LoaderCircle class="h-6 w-6 animate-spin" />}
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
			</Suspense>

			<div class="pt-2">
				<Show when={infinite.hasNextPage}>
					<Button onClick={() => infinite.fetchNextPage()}>fetch more</Button>
				</Show>
				<Show when={infinite.isFetching}>
					<LoaderCircle class="h-6 w-6 animate-spin" />
				</Show>
				<Show when={!infinite.hasNextPage && !infinite.isFetching}>
					<p>nothing more to load</p>
				</Show>
			</div>
		</>
	);
}
