import { QueryClient, useInfiniteQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { orpc } from "../lib/orpc";
import { makePersisted } from "@solid-primitives/storage";
import { createSignal, For, Show } from "solid-js";
import localforage from "localforage";
import { isServer } from "solid-js/web";
import { createServerFn } from "@tanstack/solid-start";

const prefetchMusicIds = createServerFn().handler(async () => {
	const queryClient = new QueryClient();

	const data = await queryClient.fetchInfiniteQuery(
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

	return data;
});

export const Route = createFileRoute("/music")({
	head: () => ({
		meta: [
			{
				title: "music ids - gurkan's website"
			}
		]
	}),
	loader: () => prefetchMusicIds(),
	component: RouteComponent
});

function formatId(id: string, format: "DEFAULT" | "TRAITOR_TOWN"): string {
	switch (format) {
		case "DEFAULT":
			return id;
		case "TRAITOR_TOWN":
			return `s/${id}`;
	}
}

function RouteComponent() {
	const data = Route.useLoaderData();
	const [format, setFormat] = makePersisted(createSignal<"DEFAULT" | "TRAITOR_TOWN">("DEFAULT"), {
		storage: !isServer ? localforage : undefined,
		name: "id_format"
	});
	const query = useInfiniteQuery(() =>
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | null) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: true
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: null,
			initialData: data()
		})
	);
	return (
		<>
			<div class="flex gap-2 w-fit p-2 text-black">
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

			<Show when={query.isSuccess && query.data} fallback={<p>loading...</p>}>
				<For each={query.data?.pages}>
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

				<Show when={query.hasNextPage}>
					<button onClick={() => query.fetchNextPage()} class="p-2 border-2 rounded-xl">
						fetch more
					</button>
				</Show>
			</Show>
		</>
	);
}
