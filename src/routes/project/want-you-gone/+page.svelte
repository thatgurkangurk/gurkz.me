<script lang="ts">
	import { Cake } from "./lib/cake";
	import { onMount } from "svelte";
	import musicmp3 from "./lib/music.mp3";
	import Ui from "./lib/ui.svelte";
	import { clearTimeouts } from "$lib/utils/timeouts";

	let hasStarted: boolean = false;
	let audio: HTMLAudioElement;
	let lyricsDiv: HTMLDivElement;
	let creditsDiv: HTMLDivElement;
	let lyricsText: HTMLDivElement;
	let creditsText: HTMLDivElement;

	onMount(() => {
		clearTimeouts("want-you-gone");
		hasStarted = false;
	});

	function start() {
		const cake = new Cake(lyricsDiv, creditsDiv, lyricsText, creditsText, audio);
		cake.start();
	}
</script>

{#if !hasStarted}
	<button
		class="text-3xl p-3"
		on:click|preventDefault={() => {
			hasStarted = true;
			start();
		}}>click here to start</button
	>
{/if}

<div class="wrapper" class:invisible={!hasStarted}>
	<div id="container">
		<div id="lyrics" bind:this={lyricsDiv}>
			<div id="lyricstext" bind:this={lyricsText}></div>
		</div>
		<div id="credits" bind:this={creditsDiv}>
			<div id="creditstext" bind:this={creditsText}></div>
		</div>
		<Ui />
	</div>
	<div id="buffer"></div>
</div>
<audio bind:this={audio}>
	<source src={musicmp3} />
</audio>

<style>
	@keyframes buffer {
		0% {
			top: -40%;
		}
		80%,
		100% {
			top: 140%;
		}
	}

	.invisible {
		display: none;
	}

	.wrapper {
		color: #967533;
		font-family: monospace;
		font-size: 9pt;
		line-height: 90vh;
		margin: 0;
		text-align: center;
		position: relative;
		background: #7e521d;
		background: radial-gradient(ellipse at center, #7e521d 0%, #7e521d 45%, #4a3219 100%);
		background-size: cover;
	}

	#container {
		position: relative;
		border-width: 0 2px 2px 2px;
		border-style: solid;
		border-radius: 1px;
		width: 1080px;
		height: 600px;
		vertical-align: middle;
		display: inline-block;
	}
	#container::before {
		content: "";
		background-color: #957532;
		position: absolute;
		left: 0;
		right: 36.8em;
		height: 2px;
	}
	#container::after {
		content: "";
		background-color: #957532;
		position: absolute;
		right: 0;
		width: 1.2em;
		height: 2px;
	}
	#lyrics {
		position: absolute;
		left: 2em;
		top: 2em;
		width: 30em;
		font-size: 15pt;
		line-height: 1.6;
	}

	#lyricstext {
		position: absolute;
		left: 1em;
		right: 1em;
		top: 1em;
		bottom: 1em;
		text-align: left;
	}

	#credits {
		position: absolute;
		right: 1.5em;
		top: 5em;
		width: 30em;
		color: #1f0000;
		font-size: 20px;
		font-weight: bold;
	}
	#creditstext {
		position: absolute;
		left: 2em;
		right: 1em;
		top: 1.3em;
		bottom: 1em;
		text-align: right;
		vertical-align: bottom;
		line-height: 1.6;
	}

	#buffer {
		height: 40%;
		width: 100%;
		position: fixed;
		opacity: 0.2;
		z-index: 10;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			rgba(126, 82, 29, 0) 0%,
			rgba(126, 82, 29, 0) 1%,
			rgba(126, 82, 29, 1) 100%
		);

		animation: buffer 2s linear 1s infinite normal;
	}
</style>
