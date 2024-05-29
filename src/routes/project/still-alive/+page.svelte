<script lang="ts">
	import stillalivem4a from "./stillalive.m4a";
	import CourierSansBoldTTF from "./fonts/CourierPrimeSansBold.ttf";
	import CourierSansBoldWoff2 from "./fonts/CourierPrimeSansBold.woff2";
	import { LyricRenderer } from "./utils/lyrics";
	import { ascii, artPieces } from "./utils/ascii";
	import { onMount } from "svelte";
	import { Cursor } from "./utils/cursor";
	import { createTimeout } from "./utils/timeout";
	import { TERMINAL_CURSOR_BLINK_INTERVAL } from "./utils/consts";
	import CreditsContainer from "./lib/credits-container.svelte";

	let music: HTMLAudioElement;
	let lyricsContainer: HTMLDivElement;
	let infoMessage: HTMLDivElement;
	let startButton: HTMLButtonElement;

	onMount(() => {
		ascii.set("clear");

		const terminalCursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
		const lyricRenderer = new LyricRenderer(lyricsContainer, ascii, terminalCursor);

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
		<button bind:this={startButton} id="start-btn">click here to start</button><br />
		<span>works best on a PC</span>
	</div>

	<div class="container_asciiart">
		{#each artPieces as art}
			{#if $ascii === `asciiart_${art.id}`}
				<pre id={`asciiart_${art.id}`}>{art.content}</pre>
			{/if}
		{/each}
	</div>

	<CreditsContainer />
</div>

<style>
	::selection {
		background: rgba(0, 0, 0, 0) !important;
	}

	::-moz-selection {
		background: rgba(0, 0, 0, 0) !important;
	}

	.stillalive {
		width: 100dvw;
		height: 82.4dvh;
		background-color: black !important;
		color: #debe5f !important;
		font-family: "Courier New", "Courier", "CourierPrimeSans", monospace !important;
		font-weight: 600 !important;
	}

	span {
		display: inline-block;
		line-height: 1.35 !important;
		font-size: 1em !important;
	}

	pre {
		font-family: "Courier New", "Courier", "CourierPrimeSans", monospace !important;
		margin: 0;

		-webkit-touch-callout: none !important;
		-webkit-user-select: none !important;
		-khtml-user-select: none !important;
		-moz-user-select: none !important;
		-ms-user-select: none !important;
		user-select: none !important;
	}

	a {
		text-decoration: underline;
		color: currentColor;
	}

	.info_message {
		display: none;
	}

	.container_lyrics,
	.info_message {
		position: absolute;
		width: 26.75em;
		height: 39em;
		top: calc(0.8em + 0.25em + 10.5rem);
		left: calc(0.7em + 0.25em + 2.5rem);
	}

	.info_message {
		display: block;
	}

	.container_lyrics {
		display: block;
		white-space: pre;
	}

	.container_lyrics > br {
		display: none;
	}

	.container_credits {
		display: block;
		position: absolute;
		width: 28.75em;
		height: 21em;
		top: calc(1.5em + 0.25em + 10.5rem);
		left: 32em;
	}

	.container_credits > span.row:empty:before {
		content: "\200b";
	}

	.container_asciiart {
		display: block;
		position: absolute;
		left: 38em;
		top: 40.5em;
		font-size: 14px;
	}

	.container_asciiart > pre {
		display: block;
		line-height: 1.2;
	}

	br.force-display {
		display: inline !important;
	}
</style>
