<script lang="ts">
	import "./style.css";
	import stillalivem4a from "./stillalive.m4a";
	import CourierSansBoldTTF from "./fonts/CourierPrimeSansBold.ttf";
	import CourierSansBoldWoff2 from "./fonts/CourierPrimeSansBold.woff2";
	import { LyricRenderer } from "./utils/lyrics";
	import { ascii } from "./utils/ascii";
	import { onMount } from "svelte";
	import { Cursor } from "./utils/cursor";
	import { createTimeout } from "./utils/timeout";
	import { TERMINAL_CURSOR_BLINK_INTERVAL } from "./utils/consts";
	import CreditsContainer from "./lib/credits-container.svelte";
	import Ascii from "./lib/ascii.svelte";

	let music: HTMLAudioElement;
	let lyricsContainer: HTMLDivElement;
	let infoMessage: HTMLDivElement;
	let startButton: HTMLButtonElement;

	onMount(() => {
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

	<Ascii />

	<CreditsContainer />
</div>
