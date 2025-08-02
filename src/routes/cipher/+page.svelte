<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { decode, encode } from "./lib/cipher";
	import {
		Accordion,
		AccordionItem,
		AccordionContent,
		AccordionTrigger
	} from "$lib/components/ui/accordion";

	let input = $state<string>("");

	function cipher() {
		input = encode(input);
	}
	function decipher() {
		input = decode(input);
	}
</script>

<h1 class="text-3xl">jester's cipher - by kiwiman and ghoufer</h1>

<div class="w-full max-w-xs pt-2">
	<Label>input</Label>
	<Input bind:value={input} />

	<div class="pt-2">
		<Button onclick={cipher}>cipher</Button>
		<Button onclick={decipher}>decipher</Button>
	</div>
	<br />
	<h2 class="text-2xl">questions you might have</h2>

	<Accordion type="single" class="w-full sm:max-w-[70%]" value="why">
		<AccordionItem value="why">
			<AccordionTrigger>why?</AccordionTrigger>
			<AccordionContent class="flex flex-col gap-4 text-balance">
				<p>
					why not? kiwiman, a friend of mine made this using godot to secretly talk to guiggur
					(another friend), and i translated it to a web page for easier access
				</p>
			</AccordionContent>
		</AccordionItem>
		<AccordionItem value="safe">
			<AccordionTrigger>is this safe?</AccordionTrigger>
			<AccordionContent class="flex flex-col gap-4 text-balance">
				<p>
					it doesn't send your input anywhere but it's not really too hard to brute force,
					especially since the code is public
				</p>
			</AccordionContent>
		</AccordionItem>
		<AccordionItem value="algorithm">
			<AccordionTrigger>what algorithm does it use?</AccordionTrigger>
			<AccordionContent class="flex flex-col gap-4 text-balance">
				<p>it uses the vigenère algorithm</p>
			</AccordionContent>
		</AccordionItem>
	</Accordion>
</div>
