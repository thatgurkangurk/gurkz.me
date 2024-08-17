import { createAsync } from "@solidjs/router";
import { createSignal, ErrorBoundary, Suspense } from "solid-js";
import { Show } from "solid-js";
import { CreateMusicCard } from "~/components/music/create-card";
import { IdFormatToggle } from "~/components/music/id-format";
import { MusicCardSkeleton } from "~/components/music/music-card";
import { MusicList } from "~/components/music/music-list";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import type { IdFormat } from "~/lib/music/id-format";
import { MusicProvider } from "~/lib/music/context";

export default function MusicIdList() {
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<>
			<MusicProvider>
				<h2 class="text-2xl">music id list</h2>

				<Show when={user()?.permissions.includes("CREATE_MUSIC_IDS")}>
					<CreateMusicCard />
				</Show>

				<Suspense>
					<IdFormatToggle />
				</Suspense>

				<ErrorBoundary
					fallback={(err, reset) => (
						<div>
							<p>sorry, something went wrong. error: {err.toString()}</p>{" "}
							<button type="button" onClick={() => reset()}>
								retry?
							</button>
						</div>
					)}
				>
					<Suspense
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
							</div>
						}
					>
						<MusicList />
					</Suspense>
				</ErrorBoundary>
			</MusicProvider>
		</>
	);
}
