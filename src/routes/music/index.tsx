import { useInfiniteQuery } from "@tanstack/solid-query";
import { FormatProvider } from "./_lib/format";
import { orpc } from "~/lib/orpc";
import { QueryBoundary } from "~/components/query-boundary";
import { For, Show } from "solid-js";
import { FormattedId } from "./_lib/formatted-id";
import { ClientOnly } from "solid-use/client-only";
import { FormatSelector } from "./_lib/format-selector";
import { Button } from "~/components/ui/button";

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
						<ClientOnly fallback={<Button disabled>load more</Button>}>
							<Show when={query.hasNextPage}>
								<Button
									disabled={query.isFetchingNextPage || !query.hasNextPage}
									onClick={() => {
										if (query.hasNextPage) {
											query.fetchNextPage();
											return;
										}
									}}
								>
									load more
								</Button>
							</Show>
						</ClientOnly>
					</>
				)}
			</QueryBoundary>
		</FormatProvider>
	);
}
