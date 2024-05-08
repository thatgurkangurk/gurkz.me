<script lang="ts">
	import { goto } from "$app/navigation";
	import { env } from "$env/dynamic/public";
	import { redirect } from "@sveltejs/kit";
	import PocketBase, { type AuthProviderInfo } from "pocketbase";
	import { toast } from "svelte-sonner";

	export let provider: AuthProviderInfo;

	let tokenInput: HTMLInputElement;

	const pb = new PocketBase(env.PUBLIC_BACKEND_URL);

	async function auth() {
		let w = window.open();
		const waitMessage = document.createElement("h1");
		waitMessage.innerText = "please wait...";
		w?.document.body.appendChild(waitMessage);
		await pb.collection("users").authWithOAuth2({
			provider: provider.name,
			urlCallback: (url) => {
				w?.location.replace(url);
			}
		});
	}
</script>

<form
	method="post"
	on:submit|preventDefault={async (e) => {
		const form = e.currentTarget;

		try {
			toast.loading("please wait", {
				description: "please wait while we redirect you"
			});
			await auth();
			tokenInput.value = pb.authStore.token;
			form.submit();
		} catch (err) {
			console.error(err);
			toast.error("error", {
				description: "could not sign you in"
			});
		}
	}}
>
	<input name="token" type="hidden" bind:this={tokenInput} />
	<button class="border rounded p-2 bg-gray-800 text-white hover:bg-gray-700">
		log in with {provider.displayName}
	</button>
</form>
