import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { useFFmpeg } from "~/lib/hooks/ffmpeg";
import { Button } from "../ui/button";
import { LoaderCircle, Video } from "lucide-solid";
import { Progress } from "~/components/ui/progress";

export default function VideoGifConverter() {
	const ffmpeg = useFFmpeg();
	const [file, setFile] = createSignal<File | undefined | null>();
	const [result, setResult] = createSignal<string | undefined | null>();

	async function reset() {
		await ffmpeg.reset();
		setFile(() => null);
		setResult(() => null);
	}

	onMount(async () => {
		console.log("new mount, resetting ffmpeg");
		await reset();
	});

	return (
		<>
			<Show when={ffmpeg.convertStatus() === "idle"}>
				<Switch>
					<Match when={ffmpeg.status() === "default"}>
						<p>you need to download ffmpeg :D</p>
						<Button onClick={() => ffmpeg.load()}>load ffmpeg (~20mb)</Button>
					</Match>
					<Match when={ffmpeg.status() === "loading"}>
						<Button disabled>
							<LoaderCircle class="h-6 w-6 animate-spin" /> downloading ffmpeg
						</Button>
					</Match>
					<Match when={ffmpeg.status() === "loaded"}>
						<input
							type="file"
							onChange={(e) =>
								setFile(() => e.target.files?.item(0) ?? undefined)
							}
						/>

						<Show when={file() && ffmpeg.convertStatus() === "idle"}>
							{/* biome-ignore lint/a11y/useMediaCaption: it is an user uploaded file */}
							{/* biome-ignore lint/style/noNonNullAssertion: it is safe */}
							<video controls width="250" src={URL.createObjectURL(file()!)} />
							<Button
								onClick={async () =>
									/* biome-ignore lint/style/noNonNullAssertion: it is safe */
									setResult(await ffmpeg.convertToGif(file()!))
								}
							>
								convert
							</Button>
						</Show>

						<Show when={result()}>
							{/* biome-ignore lint/style/noNonNullAssertion: it is safe */}
							<img width="500" src={result()!} alt="result" />

							<Button onClick={() => reset()}>reset</Button>
						</Show>
					</Match>
				</Switch>
			</Show>

			<Show when={ffmpeg.progress() !== null && ffmpeg.progress() !== 100}>
				<div class="w-fit gap-2 flex flex-row">
					<Progress value={ffmpeg.progress() ?? 0} />
					<p>{ffmpeg.progress()}%</p>
				</div>
			</Show>
		</>
	);
}
