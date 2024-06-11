<script lang="ts">
	import { Button } from "$lib/components/ui/button";

	export let robloxId: number;

	let audio: HTMLAudioElement;
	let isPlaying: boolean = false;
	let buttonText: string = "play";
</script>

<audio
	src={`https://api.hyra.io/audio/${robloxId}`}
	bind:this={audio}
	on:play={() => {
		isPlaying = true;
		buttonText = "pause";
	}}
	on:pause={() => {
		isPlaying = false;
		buttonText = "play";
	}}
/>
<Button
	on:click={() => {
		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
			return;
		}

		audio.currentTime = 0;
		audio.play();
	}}>{buttonText}</Button
>
