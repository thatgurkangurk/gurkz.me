<script lang="ts">
	import CourierSansBoldTTF from "./lib/fonts/CourierPrimeSansBold.ttf";
	import CourierSansBoldWoff2 from "./lib/fonts/CourierPrimeSansBold.woff2";
	import { LyricRenderer } from "./lib/lyrics";
	import { ascii, artPieces } from "./lib/ascii";
	import { onMount } from "svelte";
	import { Cursor } from "./lib/cursor";
	import { clearTimeouts, createTimeout } from "#lib/utils/timeouts.svelte.js";
	import { CreditsRenderer } from "./lib/credits";
	import styleUrl from "./style.css?url";
	import { Input } from "#lib/components/ui/input/index.js";
	import Button from "#lib/components/ui/button/button.svelte";

	let hasStarted = $state(false);
	let audioSrc = $state<string | null>(null);

	let music: HTMLAudioElement;
	let creditsContainer: HTMLDivElement;
	let lyricsContainer: HTMLDivElement;

	let lyricRenderer: LyricRenderer;
	let creditsRenderer: CreditsRenderer;
	let terminalCursor: Cursor;
	let creditCursor: Cursor;

	const CREDIT_CHARACTER_VELOCITY_MS = 68.623562;
	const TERMINAL_CURSOR_BLINK_INTERVAL = 300;

	onMount(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = styleUrl;
		document.head.appendChild(link);

		clearTimeouts("still-alive");
		ascii.set("clear");
		hasStarted = false;

		terminalCursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
		creditCursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);

		lyricRenderer = new LyricRenderer(lyricsContainer, ascii, terminalCursor);
		creditsRenderer = new CreditsRenderer(
			CREDIT_CHARACTER_VELOCITY_MS,
			creditsContainer,
			creditCursor
		);

		createTimeout(
			"still-alive",
			() => {
				if (creditsContainer instanceof HTMLElement) {
					for (let i = 0, len = 16; i < len; i++) {
						const spanElement = document.createElement("span");
						spanElement.className = `row row${i}`;
						spanElement.id = `row${i}`;
						creditsContainer.appendChild(spanElement);

						if (i !== len - 1) {
							const brElement = document.createElement("br");
							brElement.className = "force-display";
							creditsContainer.appendChild(brElement);
						}
					}

					creditCursor.position(document.querySelector(".container_credits>span.row15")!);
					creditCursor.startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
				}
			},
			TERMINAL_CURSOR_BLINK_INTERVAL
		);

		return () => {
			clearTimeouts("still-alive");
			if (document.head.contains(link)) {
				document.head.removeChild(link);
			}
		};
	});

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			if (audioSrc) {
				URL.revokeObjectURL(audioSrc);
			}
			audioSrc = URL.createObjectURL(file);
		}
	}

	function start() {
		hasStarted = true;
		lyricRenderer.start();

		if (music) {
			music.play();
			music.muted = true;

			createTimeout(
				"still-alive",
				() => {
					music.muted = false;
					music.currentTime = 0;
				},
				6750
			);
			createTimeout(
				"still-alive",
				() => {
					creditsRenderer.startTypingCredits();
				},
				9000
			);
		}
	}
</script>

<svelte:head>
	<link
		rel="preload"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		href={CourierSansBoldWoff2}
	/>
	<link rel="preload" as="font" type="font/ttf" crossorigin="anonymous" href={CourierSansBoldTTF} />
</svelte:head>

{#if !hasStarted}
	<div class="flex flex-col items-center justify-center gap-4 p-8" style="color: white;">
		<p class="text-xl font-bold">
			i obviously can't distribute the mp3, so you can upload it here (not required however)
		</p>
		<div class="w-full max-w-sm">
			<label for="mp3-upload" class="mb-2 block text-sm font-medium">still alive mp3</label>
			<Input id="mp3-upload" type="file" accept="audio/mp3,audio/*" onchange={handleFileChange} />
		</div>

		<Button
			onclick={(e) => {
				e.preventDefault();
				start();
			}}
		>
			click here to start
		</Button>
	</div>
{/if}

<audio bind:this={music} src={audioSrc ?? undefined} controls hidden>
	<p>your browser does not support the audio tag</p>
</audio>

<div class="stillalive" class:invisible={!hasStarted}>
	<div class="container_lyrics_border">
		<pre>
    ----------------------------------------------   -----------------------------------------------
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             ||                                               |
    |                                             | -------------------------------------------------
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    |                                             |
    ----------------------------------------------</pre>
	</div>

	<div class="container_lyrics" bind:this={lyricsContainer}></div>

	<div class="container_asciiart">
		{#each artPieces as art}
			{#if $ascii === `asciiart_${art.id}`}
				<pre id={`asciiart_${art.id}`}>{art.content}</pre>
			{/if}
		{/each}
	</div>

	<div class="container_credits" bind:this={creditsContainer}></div>
</div>
