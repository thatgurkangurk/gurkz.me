import { useInfiniteQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { orpc } from "~/lib/orpc";

export default function Home() {
	const query = useInfiniteQuery(() =>
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | null) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: true
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: null
		})
	);
	return (
		<>
			<div class="bg-amber-500 p-2">
				<h3>hello</h3>
				<p>i'm restructuring a bit so the website will be a bit bare-bones for a while</p>
			</div>
			<Show when={query.isFetched && query.data}>
				<For each={query.data?.pages}>
					{(page) => (
						<For each={page.data}>
							{(musicId) => {
								const [isCopying, setIsCopying] = createSignal<boolean>(false);

								return (
									<p>
										{musicId.name} - {musicId.robloxId}
										<button
											onClick={() => {
												setIsCopying(true);
												navigator.clipboard.writeText(musicId.robloxId);
												setTimeout(() => {
													setIsCopying(false);
												}, 300);
											}}
											class="underline"
										>
											<Show when={isCopying()} fallback="copy">
												copied
											</Show>
										</button>
									</p>
								);
							}}
						</For>
					)}
				</For>

				<Show when={query.hasNextPage}>
					<button onClick={() => query.fetchNextPage()} class="p-2 border-2 rounded-xl">
						fetch more
					</button>
				</Show>
			</Show>
		</>
	);
}
