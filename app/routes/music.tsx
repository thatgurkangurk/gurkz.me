import { QueryClient, useInfiniteQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { orpc } from "../lib/orpc";
import { createSignal, For, Show } from "solid-js";
import { createServerFn } from "@tanstack/solid-start";
import { FormatProvider, useMusicIdFormat } from "../lib/music";

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
	component: () => {
		return (
			<FormatProvider initial="DEFAULT">
				<RouteComponent />
			</FormatProvider>
		);
	}
});

function RouteComponent() {
	const { format, setFormat, formatId } = useMusicIdFormat();
	const data = Route.useLoaderData();
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
										{musicId.name} - {formatId(musicId.robloxId)}
										<button
											onClick={() => {
												setIsCopying(true);
												navigator.clipboard.writeText(formatId(musicId.robloxId));
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
