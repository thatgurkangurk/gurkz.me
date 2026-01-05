<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import { onMount, tick } from "svelte";

	let videoElem = $state<HTMLVideoElement | null>(null);
	let tableElem = $state<HTMLTableElement | null>(null);
	let videoSrc = $state("");

	let isSafari = $state(false);
	let isDefault = $state(true);
	let videoLoaded = $state(false);

	let targetCols = $state(100); // main resolution knob
	const cellSize = 6; // visual pixel size

	let naturalWidth = 0;
	let naturalHeight = 0;

	let gridCols = 0;
	let gridRows = 0;
	let stepX = 1;
	let stepY = 1;

	let sampleX: number[] = [];
	let sampleY: number[] = [];

	let cellGrid: HTMLTableCellElement[][] = [];
	let lastColors: string[][] = [];

	const canvas = document.createElement("canvas");
	let ctx: CanvasRenderingContext2D | null = null;

	function checkDevice() {
		isSafari =
			["iPad", "iPhone", "iPod"].includes(navigator.platform) ||
			(navigator.userAgent.includes("Mac") && "ontouchend" in document);
	}

	function createTable(table: HTMLTableElement, rows: number, cols: number) {
		table.innerHTML = "";
		cellGrid = [];
		lastColors = [];

		for (let y = 0; y < rows; y++) {
			const row = table.insertRow();
			const rowCells: HTMLTableCellElement[] = [];
			lastColors[y] = [];

			for (let x = 0; x < cols; x++) {
				const cell = row.insertCell();
				cell.style.width = `${cellSize}px`;
				cell.style.height = `${cellSize}px`;
				rowCells.push(cell);
				lastColors[y][x] = "";
			}

			cellGrid.push(rowCells);
		}
	}

	let lastTime = 0;
	function drawLoop(time = 0) {
		if (!videoElem || !ctx || !tableElem) return;

		// cap at 30fps
		if (time - lastTime < 33) {
			requestAnimationFrame(drawLoop);
			return;
		}
		lastTime = time;

		ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
		const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = frame.data;

		for (let y = 0; y < gridRows; y++) {
			const py = sampleY[y];
			const rowCells = cellGrid[y];

			for (let x = 0; x < gridCols; x++) {
				const px = sampleX[x];
				const i = (py * canvas.width + px) * 4;
				const color = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
				if (lastColors[y][x] !== color) {
					lastColors[y][x] = color;
					rowCells[x].style.backgroundColor = color;
				}
			}
		}

		requestAnimationFrame(drawLoop);
	}

	async function handleLoadedMetadata() {
		const v = videoElem!;
		naturalWidth = v.videoWidth;
		naturalHeight = v.videoHeight;

		const aspect = naturalWidth / naturalHeight;

		gridCols = targetCols;
		gridRows = Math.floor(targetCols / aspect);

		stepX = naturalWidth / gridCols;
		stepY = naturalHeight / gridRows;

		sampleX = Array.from({ length: gridCols }, (_, x) => Math.floor(x * stepX));
		sampleY = Array.from({ length: gridRows }, (_, y) => Math.floor(y * stepY));

		canvas.width = naturalWidth;
		canvas.height = naturalHeight;
		ctx = canvas.getContext("2d", { willReadFrequently: true });

		videoLoaded = true;
		await tick();
		createTable(tableElem!, gridRows, gridCols);
	}

	function handlePlay() {
		isDefault = false;
		drawLoop();
	}

	onMount(checkDevice);
</script>

{#if !isSafari}
	{#if isDefault}
		<Card>
			<CardHeader>
				<CardTitle>choose a video</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex flex-col gap-3">
					<label>
						resolution (cols) SET ME FIRST!
						<input type="range" min="40" max="300" step="10" bind:value={targetCols} />
						<span>{targetCols}</span>
					</label>

					<input
						type="file"
						accept="video/mp4"
						onchange={(e) => {
							const f = (e.target as HTMLInputElement).files?.[0];
							if (f) videoSrc = URL.createObjectURL(f);
						}}
					/>
				</div>
			</CardContent>
			<CardFooter>
				<CardDescription>
					<p class="p-2 pl-6">note: the video never gets uploaded</p>
				</CardDescription>
			</CardFooter>
		</Card>
		<div class="controls">
			{#if videoSrc}
				<button onclick={() => videoElem?.play()}>start</button>
			{/if}
		</div>
	{/if}

	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElem}
		src={videoSrc}
		controls
		playsinline
		style="display:none"
		onloadedmetadata={handleLoadedMetadata}
		onplay={handlePlay}
	></video>

	{#if videoLoaded}
		<table bind:this={tableElem} style="border-collapse:collapse; table-layout: fixed;"></table>
	{/if}
{:else}
	<p>iOS/iPadOS is currently unsupported</p>
{/if}

<style>
	.controls {
		padding: 1rem;
	}

	:global {
		table td {
			padding: 0;
		}
	}
</style>
