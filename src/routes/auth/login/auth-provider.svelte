<script lang="ts">
	import { env } from "$env/dynamic/public";
	import PocketBase, { type AuthProviderInfo } from "pocketbase";

	export let provider: AuthProviderInfo;

	let tokenInput: HTMLInputElement;

	const pb = new PocketBase(env.PUBLIC_BACKEND_URL);
</script>

<form
	method="post"
	on:submit|preventDefault={async (e) => {
		const form = e.currentTarget;

		try {
			await pb.collection("users").authWithOAuth2({ provider: provider.name });
			tokenInput.value = pb.authStore.token;
			form.submit();
		} catch (err) {
			console.error(err);
		}
	}}
>
	<input name="token" type="hidden" bind:this={tokenInput} />
	<button class="border rounded p-2 bg-gray-800 text-white hover:bg-gray-700">
		log in with {provider.displayName}
	</button>
</form>
