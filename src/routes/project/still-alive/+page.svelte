<script lang="ts">
	import stillalivem4a from "./stillalive.m4a";
	import CourierSansBoldTTF from "./fonts/CourierPrimeSansBold.ttf";
	import CourierSansBoldWoff2 from "./fonts/CourierPrimeSansBold.woff2";
	import { LyricRenderer } from "./utils/lyrics";
	import { ascii, artPieces } from "./utils/ascii";
	import { onMount } from "svelte";
	import "./style.css";
	import { Cursor } from "./utils/cursor";
	import { clearTimeouts, createTimeout } from "./utils/timeout";
	import { CreditsRenderer } from "./utils/credits";

	let music: HTMLAudioElement;
	let creditsContainer: HTMLDivElement;
	let lyricsContainer: HTMLDivElement;
	let infoMessage: HTMLDivElement;
	let startButton: HTMLButtonElement;

	onMount(() => {
		clearTimeouts();
		ascii.set("clear");

		const CREDIT_CHARACTER_VELOCITY_MS = 68.623562;
		const TERMINAL_CURSOR_BLINK_INTERVAL = 300;

		const terminalCursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
		const creditCursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);

		const lyricRenderer = new LyricRenderer(lyricsContainer, ascii, terminalCursor);
		const creditsRenderer = new CreditsRenderer(
			CREDIT_CHARACTER_VELOCITY_MS,
			creditsContainer,
			creditCursor
		);

		createTimeout(() => {
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
		}, TERMINAL_CURSOR_BLINK_INTERVAL);
		music.addEventListener("canplaythrough", (e) => {
			e.preventDefault();
			infoMessage.style.display = "block";
			const containerLyricsBeforeMobileSpan = infoMessage.querySelector("span");
			if (containerLyricsBeforeMobileSpan) {
				terminalCursor.position(containerLyricsBeforeMobileSpan);
			}
		});

		startButton.addEventListener("click", (e) => {
			e.preventDefault();
			infoMessage.remove();

			lyricRenderer.start();

			if (music) {
				music.play();
				music.muted = true;

				createTimeout(() => {
					music.muted = false;
					music.currentTime = 0;
				}, 6750);
				createTimeout(() => {
					creditsRenderer.startTypingCredits();
				}, 9000);
			}
		});
	});
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

<audio bind:this={music} controls hidden>
	<source src={stillalivem4a} type="audio/mp4" />
	<p>your browser does not support the audio tag</p>
</audio>

<div class="stillalive">
	<div class="container_lyrics_border">
		<pre>
	----------------------------------------------   -----------------------------------------------
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
	|                                             ||                                                 |
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

	<div class="info_message" bind:this={infoMessage}>
		<button bind:this={startButton}>click here to start</button><br />
		<span>works best on a PC</span>
	</div>

	<div class="container_asciiart">
		{#each artPieces as art}
			{#if $ascii === `asciiart_${art.id}`}
				<pre id={`asciiart_${art.id}`}>{art.content}</pre>
			{/if}
		{/each}
	</div>

	<div class="container_credits" bind:this={creditsContainer}></div>
</div>
