import { type Accessor, For, type Setter, Show } from "solid-js";
import { MusicCard, MusicCardSkeleton } from "./music-card";
import { trpc } from "~/lib/trpc/client";
import { LoaderCircle } from "lucide-solid";
import { Button } from "../ui/button";
import type { IdFormat } from "~/lib/music/id-format";

export function MusicList(props: {
	idFormat: Accessor<IdFormat>;
	setIdFormat: Setter<IdFormat>;
}) {
	const query = trpc.music.getInfiniteMusicIds.createInfiniteQuery(
		() => ({
			limit: 24,
		}),
		() => ({
			getNextPageParam: (previousPage) => previousPage.nextCursor,
			initialPageParam: undefined, //? this surprisingly works
		}),
	);
	return (
		<>
			<Show
				when={!query.isLoading}
				fallback={
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
				}
			>
				<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
					<For each={query.data?.pages}>
						{(page) => (
							<>
								<For each={page.data}>
									{(item) => (
										<MusicCard
											idFormat={props.idFormat}
											setIdFormat={props.setIdFormat}
											musicId={item.id}
										/>
									)}
								</For>
							</>
						)}
					</For>
				</div>
			</Show>

			<Show when={query.hasNextPage} fallback={<p>you have reached the end</p>}>
				<Button
					disabled={query.isFetchingNextPage}
					onClick={() => query.fetchNextPage()}
				>
					<Show when={query.isFetchingNextPage}>
						<LoaderCircle class="h-6 w-6 animate-spin" />
					</Show>
					fetch more
				</Button>
			</Show>
		</>
	);
}
