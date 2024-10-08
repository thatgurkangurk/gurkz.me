import { createSignal, onMount, Switch, Match, Show } from "solid-js";
import video from "~/components/projects/badapple/badapple.mp4";
import { createEmitter } from "@solid-primitives/event-bus";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import { isServer } from "solid-js/web";

const [videoElem, setVideoElem] = createSignal<HTMLVideoElement>();
const [videoSrc, setVideoSrc] = createSignal<string>("");
const events = createEmitter<{
	play: HTMLVideoElement;
	pause: HTMLVideoElement;
}>();

function createTable(props: {
	table: HTMLTableElement;
	height: number;
	width: number;
}) {
	const body = document.createElement("tbody");

	for (let y = 0; y < props.height; y++) {
		const row = props.table.insertRow(y);
		row.style.width = "5px";
		row.style.height = "5px";
		for (let x = 0; x < props.width; x++) {
			const cell = row.insertCell(x);
			cell.style.width = "5px";
			cell.style.height = "5px";
		}
	}

	props.table.appendChild(body);
	return props.table;
}

function VideoSelector() {
	return (
		<Card class="w-fit">
			<CardHeader>
				<CardTitle>choose a video</CardTitle>
			</CardHeader>
			<CardContent>
				choose between the bad apple video or you can upload your own
			</CardContent>
			<CardFooter>
				<div class="flex flex-row gap-3">
					<Button
						onClick={() => {
							setVideoSrc(video);
						}}
					>
						bad apple video
					</Button>
					<input
						accept=".mp4"
						onChange={(e) => {
							if (e.target.files) {
								const file = e.target.files[0];
								if (file) {
									const videoUrl = URL.createObjectURL(file);
									setVideoSrc(videoUrl);
								}
							}
						}}
						type="file"
					/>
				</div>
				<br />
			</CardFooter>
			<CardDescription>
				<p class="p-2 pl-6">note: the video never gets uploaded</p>
			</CardDescription>
		</Card>
	);
}

function VideoPlayer() {
	return (
		// biome-ignore lint/a11y/useMediaCaption: no caption needed
		<video
			onPlay={() => {
				if (videoElem()) {
					// biome-ignore lint/style/noNonNullAssertion: it is safe
					events.emit("play", videoElem()!);
				}
			}}
			onPause={() => {
				if (videoElem()) {
					// biome-ignore lint/style/noNonNullAssertion: it is safe
					events.emit("pause", videoElem()!);
				}
			}}
			ref={setVideoElem}
			width="240"
			height="180"
			controls
			playsinline
			src={videoSrc()}
		/>
	);
}

export default function Apple() {
	const [isSafari, setIsSafari] = createSignal<boolean>(false);
	const [canvasElem] = createSignal<HTMLCanvasElement | null>(
		isServer ? null : document.createElement("canvas"),
	);
	//? this is basically only used to hide the downscale factor input
	const [isDefault, setIsDefault] = createSignal<boolean>(true);
	const [tableElem, setTableElem] = createSignal<HTMLTableElement>();
	const [downscaleFactor, setDownscaleFactor] = createSignal<number>(3);

	function checkDevice() {
		const result =
			[
				"iPad Simulator",
				"iPhone Simulator",
				"iPod Simulator",
				"iPad",
				"iPhone",
				"iPod",
			].includes(navigator.platform) ||
			// iPad on iOS 13+ detection
			(navigator.userAgent.includes("Mac") && "ontouchend" in document);

		setIsSafari(result);
	}

	onMount(() => {
		if (isServer) return;
		setVideoSrc("");
		checkDevice();
		setIsDefault(true);
		// biome-ignore lint/style/noNonNullAssertion: it is safe since it is in onMount
		const video = videoElem()!;
		// biome-ignore lint/style/noNonNullAssertion: it is safe since it is in onMount
		const table = tableElem()!;
		// biome-ignore lint/style/noNonNullAssertion: it is safe since it is in onMount
		const canvas = canvasElem()!;

		const context = canvas.getContext("2d", { willReadFrequently: true });

		if (!context) {
			alert("no context");
			return;
		}
		canvas.width = video.width;
		canvas.height = video.height;

		function fillTableCell(
			table: HTMLTableElement,
			x: number,
			y: number,
			color: string,
		) {
			table.rows[y].cells[x].style.backgroundColor = color;
		}

		function getRGBColorFromPixel(
			ctx: CanvasRenderingContext2D,
			x: number,
			y: number,
		) {
			const { data } = ctx.getImageData(x, y, 1, 1);
			return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
		}

		setTableElem(
			createTable({
				table,
				height: canvas.height / downscaleFactor(),
				width: canvas.width / downscaleFactor(),
			}),
		);

		events.on("play", (video) => {
			setIsDefault(false);
			const frame = video;

			function draw() {
				try {
					context?.drawImage(frame, 0, 0, canvas.width, canvas.height);
				} catch (e) {
					alert("cannot draw");
				}
				for (let y = 0; y < video.height; y += downscaleFactor()) {
					for (let x = 0; x < video.width; x += downscaleFactor()) {
						// the table size is already downscaled by the `downscaleFactor`
						fillTableCell(
							table,
							x / downscaleFactor(),
							y / downscaleFactor(),
							// biome-ignore lint/style/noNonNullAssertion: it should be safe
							getRGBColorFromPixel(context!, x, y),
						);
					}
				}

				requestAnimationFrame(draw);
			}

			requestAnimationFrame(draw);
		});
	});

	return (
		<Switch fallback={<p>uh oh</p>}>
			<Match when={!isSafari()}>
				<Show when={isDefault()}>
					<div class="pt-4">
						<TextFieldRoot
							onChange={(value) => {
								setDownscaleFactor(Number.parseInt(value));
							}}
						>
							<TextField
								type="number"
								id="downscalefactor"
								placeholder="3"
								value="3"
							/>
						</TextFieldRoot>

						<label for="downscalefactor"> downscale factor</label>
						<br />
						<hr />
						<VideoSelector />
						<br />
					</div>
				</Show>
				<VideoPlayer />
				<br />
				<table style={{ "border-collapse": "collapse" }} ref={setTableElem} />
			</Match>
			<Match when={isSafari()}>
				<Card>
					you seem to be on iOS (or iPadOS), this won't work on there. i am
					working on a solution, thanks for your patience.{" "}
					<a href="https://github.com/thatgurkangurk/gurkz.me/issues/10">
						learn more
					</a>
				</Card>
				<button
					type="button"
					onClick={() => {
						setIsSafari(false);
					}}
				>
					no, let me try it anyways
				</button>
			</Match>
		</Switch>
	);
}
