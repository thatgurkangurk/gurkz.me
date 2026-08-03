<script lang="ts">
	import SigninModal from "$lib/components/signin-modal.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";
	import { ExternalLink } from "@lucide/svelte";
</script>

<h1 class="text-3xl">hello!</h1>

<SigninModal>
	{#snippet button(props)}
		<button onclick={props.toggleOpen}>sign in</button>
	{/snippet}
</SigninModal>

<p>i make random things</p>
<br />
<p>here are some of them:</p>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
	<Card class="flex h-full flex-col">
		<CardHeader>
			<CardTitle>traitor town core</CardTitle>
			<CardDescription>
				youtube series (currently on hiatus, will return later in 2026)
			</CardDescription>
		</CardHeader>

		<CardContent class="flex-1">
			compilations of user submitted clips from the Roblox game Traitor Town
		</CardContent>

		<CardFooter>
			<Button
				rel="noopener noreferrer"
				target="_blank"
				href="https://www.youtube.com/playlist?list=PLBUjzDleq4Bg"
			>
				<ExternalLink /> watch now
			</Button>
			<Button
				variant="link"
				rel="noopener noreferrer"
				target="_blank"
				href="https://ttcore.gurkz.me"
			>
				<ExternalLink /> submit clips
			</Button>
		</CardFooter>
	</Card>

	<Card class="flex h-full flex-col">
		<CardHeader>
			<CardTitle>skekbot-rs</CardTitle>
			<CardDescription>self hostable & lua(u) extendable Discord bot in Rust</CardDescription>
		</CardHeader>

		<CardContent class="flex-1">
			<p>
				port of the skekbot Discord bot skekbot by Skekdog to Rust (with additional functionality)
			</p>
			<br />
			<p>fully open-source and self hostable using a docker container</p>
		</CardContent>

		<CardFooter>
			<Button
				rel="noopener noreferrer"
				target="_blank"
				href="https://github.com/thatgurkangurk/skekbot-rs"
			>
				<ExternalLink /> view source on GitHub
			</Button>
		</CardFooter>
	</Card>

	<Card class="flex h-full flex-col">
		<CardHeader>
			<CardTitle>are-we-there-yet</CardTitle>
			<CardDescription
				>tool to check if your Modrinth mods are on a specified Minecraft version</CardDescription
			>
		</CardHeader>

		<CardContent class="flex-1">
			<p>
				a command line tool to check if your Modrinth (also supports Packwiz) modpacks are on a
				specific Minecraft version
			</p>
			<br />
			<p>useful when updating a modpack to the latest Minecraft version</p>
		</CardContent>

		<CardFooter>
			<Button
				rel="noopener noreferrer"
				target="_blank"
				href="https://github.com/thatgurkangurk/are-we-there-yet"
			>
				<ExternalLink /> view source on GitHub
			</Button>
			<Button variant="link" href="/awty">web version</Button>
		</CardFooter>
	</Card>
</div>
