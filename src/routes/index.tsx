import { useInfiniteQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { orpc } from "~/lib/orpc";
import { QueryBoundary } from "~/components/query-boundary";
import { ClientOnly } from "solid-use/client-only";

function formatId(id: string, format: "DEFAULT" | "TRAITOR_TOWN"): string {
	switch (format) {
		case "DEFAULT":
			return id;
		case "TRAITOR_TOWN":
			return `s/${id}`;
	}
}

export default function Home() {
	const [format, setFormat] = makePersisted(createSignal<"DEFAULT" | "TRAITOR_TOWN">("DEFAULT"), {
		storage: cookieStorage,
		name: "id_format"
	});

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
		<>
			<div class="bg-amber-500 p-2">
				<h3>hello</h3>
				<p>i'm restructuring a bit so the website will be a bit bare-bones for a while</p>
			</div>

			<div class="flex gap-2 bg-gray-200 w-fit p-2">
				<button
					disabled={format() === "DEFAULT"}
					class="p-2 bg-green-200 disabled:bg-green-500"
					onClick={() => setFormat("DEFAULT")}
				>
					default
				</button>
				<button
					disabled={format() === "TRAITOR_TOWN"}
					class="p-2 bg-green-200 disabled:bg-green-500"
					onClick={() => setFormat("TRAITOR_TOWN")}
				>
					traitor
				</button>
			</div>

			<div>
				<QueryBoundary query={query}>
					{(data) => (
						<>
							<For each={data.pages}>
								{(page) => (
									<For each={page.data}>
										{(musicId) => {
											const [isCopying, setIsCopying] = createSignal<boolean>(false);

											return (
												<p>
													{musicId.name} - {formatId(musicId.robloxId, format())}
													<button
														onClick={() => {
															setIsCopying(true);
															navigator.clipboard.writeText(formatId(musicId.robloxId, format()));
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
			</div>
		</>
	);
}
