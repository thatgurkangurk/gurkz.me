import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { useFFmpeg } from "~/lib/hooks/ffmpeg";
import { Button } from "../ui/button";
import { LoaderCircle, Video } from "lucide-solid";
import { Progress } from "~/components/ui/progress";
import { createDropzone } from "@soorria/solid-dropzone";

const [file, setFile] = createSignal<File | undefined | null>();

function Dropzone() {
	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 1) {
			console.warn(
				"[dropzone] there was more than 1 file (somehow), only using the first one",
			);
		}

		const file = acceptedFiles[0];

		setFile(file);
	};

	const dropzone = createDropzone({ accept: "video/mp4", onDrop, maxFiles: 1 });

	return (
		<div
			class="py-8 cursor-pointer outline rounded-md outline-6 dark:outline-gray-600 w-48 h-32 flex justify-center items-center"
			{...dropzone.getRootProps()}
		>
			<input {...dropzone.getInputProps()} />
			{dropzone.isDragActive ? (
				<p>drop here</p>
			) : (
				<div class="text-center">
					<p>click here to upload</p>
					<p>you can also drag and drop</p>
				</div>
			)}
		</div>
	);
}

export default function VideoGifConverter() {
	const ffmpeg = useFFmpeg();
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
						<Dropzone />
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
