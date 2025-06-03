import { useInfiniteQuery } from "@tanstack/solid-query";
import { FormatProvider } from "./_lib/format";
import { orpc } from "~/lib/orpc";
import { QueryBoundary } from "~/components/query-boundary";
import { For, Show } from "solid-js";
import { ClientOnly } from "solid-use/client-only";
import { FormatSelector } from "./_lib/format-selector";
import { Button } from "~/components/ui/button";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import { MusicCard } from "./_lib/music-card";

function LoadMoreButton(props: {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- its fine since it doesnt need the result
	fetchNextPage: (...args: any[]) => any;
}) {
	return (
		<>
			{/* this is to prevent hydration mismatches since query.hasNextPage is false initially */}
			<ClientOnly fallback={<Button disabled>load more</Button>}>
				<Show when={props.hasNextPage}>
					<Button
						disabled={props.isFetchingNextPage || !props.hasNextPage}
						onClick={() => {
							if (props.hasNextPage) {
								props.fetchNextPage();
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
				query={query}
				loadingFallback={<LoaderCircle size={48} class="animate-spin" />}
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

						<LoadMoreButton
							hasNextPage={query.hasNextPage}
							isFetchingNextPage={query.isFetchingNextPage}
							fetchNextPage={query.fetchNextPage}
						/>
					</div>
				)}
			</QueryBoundary>
		</FormatProvider>
	);
}
