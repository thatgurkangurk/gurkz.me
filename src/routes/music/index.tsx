import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/solid-query";
import { FormatProvider } from "./_lib/format";
import { orpc } from "~/lib/orpc";
import { For, Show } from "solid-js";
import { ClientOnly } from "solid-use/client-only";
import { FormatSelector } from "./_lib/format-selector";
import { Button } from "~/components/ui/button";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import { MusicCard } from "./_lib/music-card";
import { QueryBoundary } from "~/components/query-boundary";

function LoadMoreButton(props: { query: UseInfiniteQueryResult<unknown, Error> }) {
	return (
		<>
			{/* this is to prevent hydration mismatches since query.hasNextPage is false initially */}
			<ClientOnly fallback={<Button disabled>load more</Button>}>
				<Show when={props.query.hasNextPage}>
					<Button
						disabled={props.query.isFetchingNextPage || !props.query.hasNextPage}
						onClick={() => {
							if (props.query.hasNextPage) {
								props.query.fetchNextPage();
								return;
							}
						}}
					>
						load more
					</Button>
				</Show>
			</ClientOnly>
		</>
	);
}

export default function MusicPage() {
	const query = useInfiniteQuery(() =>
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | null) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: true
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
			initialPageParam: null
		})
	);

	return (
		<FormatProvider initial="DEFAULT">
			<h1 class="text-3xl">music id list</h1>

			<FormatSelector />

			<QueryBoundary
				loadingFallback={<LoaderCircle size={48} class="animate-spin" />}
				query={query}
			>
				{(data) => (
					<div class="px-2">
						<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
							<For each={data.pages}>
								{(page) => (
									<For each={page.data}>{(musicId) => <MusicCard musicId={musicId} />}</For>
								)}
							</For>
						</div>

						<LoadMoreButton query={query} />
					</div>
				)}
			</QueryBoundary>
		</FormatProvider>
	);
}
