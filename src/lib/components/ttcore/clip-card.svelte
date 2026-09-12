<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from "#lib/components/ui/accordion/index.js";
	import { Avatar, AvatarFallback, AvatarImage } from "#lib/components/ui/avatar/index.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import type { Clip } from "#lib/types/clip.js";

	import type { Snippet } from "svelte";

	type Props = {
		clip: Clip;
		footer?: Snippet;
	};

	let { clip, footer }: Props = $props();
</script>

<Card class="flex h-full w-full flex-col justify-between">
	<CardHeader>
		<CardTitle class="text-xl">{clip.title}</CardTitle>
	</CardHeader>

	<CardContent class="flex-1">
		<div class="aspect-video w-full overflow-hidden rounded-lg">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				class="h-full w-full object-cover"
				src={clip.url}
				poster={`/api/clips/${clip.id}/thumbnail`}
				controls
				preload="none"
			></video>
		</div>
	</CardContent>

	<CardFooter class="flex flex-col gap-2 border-t pt-3">
		<!-- Top Row: Creator Info & Actions -->
		<div class="flex w-full items-center justify-between gap-2">
			<div class="flex items-center gap-2 overflow-hidden">
				<Avatar class="h-6 w-6 shrink-0 border">
					<AvatarImage src={clip.creator?.image} alt={clip.creator?.name} />
					<AvatarFallback class="text-[10px]">
						{clip.creator?.name
							?.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2) ?? "??"}
					</AvatarFallback>
				</Avatar>

				<span class="truncate text-xs font-semibold text-foreground">
					{clip.creator?.name ?? "Unknown"}
				</span>
			</div>

			<div class="flex shrink-0 items-center gap-1.5">
				{@render footer?.()}
			</div>
		</div>

		<!-- Collapsible Note Section -->
		{#if clip.note}
			<Accordion type="single" class="w-full">
				<AccordionItem value="item-1" class="border-b-0">
					<AccordionTrigger class="py-1 text-xs">note</AccordionTrigger>
					<AccordionContent class="text-xs whitespace-pre-wrap text-muted-foreground">
						{clip.note}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		{/if}

		<!-- Bottom ID Line -->
		<div class="flex w-full items-center justify-between pt-1 text-[10px] text-muted-foreground/50">
			<span>id</span>
			<code class="truncate pl-4 font-mono text-[10px] select-all" title={clip.id}>
				{clip.id ?? ""}
			</code>
		</div>
	</CardFooter>
</Card>
