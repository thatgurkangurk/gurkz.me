import { useInfiniteQuery } from "@tanstack/solid-query";
import { FormatProvider } from "./_lib/format";
import { orpc } from "~/lib/orpc";
import { QueryBoundary } from "~/components/query-boundary";
import { For, Show } from "solid-js";
import { FormattedId } from "./_lib/formatted-id";
import { ClientOnly } from "solid-use/client-only";
import { FormatSelector } from "./_lib/format-selector";

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

			<QueryBoundary query={query}>
				{(data) => (
					<>
						<For each={data.pages}>
							{(page) => (
								<For each={page.data}>{(musicId) => <FormattedId musicId={musicId} />}</For>
							)}
						</For>

						{/* this is to prevent hydration mismatches since query.hasNextPage is false initially */}
						<ClientOnly fallback={<button class="p-2 border-2 rounded-xl">load more</button>}>
							<Show when={query.hasNextPage}>
								<button
									onClick={() => {
										if (query.hasNextPage) {
											query.fetchNextPage();
											return;
										}
									}}
									class="p-2 border-2 rounded-xl"
								>
									load more
								</button>
							</Show>
						</ClientOnly>
					</>
				)}
			</QueryBoundary>
		</FormatProvider>
	);
}
