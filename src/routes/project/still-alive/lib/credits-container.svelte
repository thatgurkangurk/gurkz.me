<script lang="ts">
	import { onMount } from "svelte";
	import { CREDIT_CHARACTER_VELOCITY_MS, TERMINAL_CURSOR_BLINK_INTERVAL } from "../utils/consts";
	import { CreditsRenderer } from "../utils/credits";
	import { Cursor } from "../utils/cursor";
	import { createTimeout } from "../utils/timeout";

	let container: HTMLDivElement;

	function setupRows(container: HTMLDivElement, cursor: Cursor) {
		if (container instanceof HTMLElement) {
			console.log("it is a HTMLElement");
			for (let i = 0, len = 16; i < len; i++) {
				console.log("creating item");
				const spanElement = document.createElement("span");
				spanElement.className = `row row${i}`;
				spanElement.id = `row${i}`;
				container.appendChild(spanElement);

				if (i !== len - 1) {
					const brElement = document.createElement("br");
					brElement.className = "force-display";
					container.appendChild(brElement);
				}
			}

			cursor.position(document.querySelector(".container_credits>span.row15")!);
			cursor.startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
		}
	}

	onMount(() => {
		const startButton = document.getElementById("start-btn") as HTMLButtonElement;
		console.log(startButton);
		const cursor = new Cursor().startBlink(TERMINAL_CURSOR_BLINK_INTERVAL);
		const renderer = new CreditsRenderer(CREDIT_CHARACTER_VELOCITY_MS, container, cursor);

		startButton.addEventListener("click", () => {
			setupRows(container, cursor);
			console.log("clicked on the start button");
			createTimeout(() => {
				console.log("starting typing credits");
				renderer.startTypingCredits();
			}, 9000);
		});
	});
</script>

<div class="container_credits" bind:this={container}></div>
