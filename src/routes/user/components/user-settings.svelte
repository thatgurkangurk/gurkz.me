<script lang="ts">
	import ApiKeys from "./user-settings/api-keys.svelte";
	import DisplayName from "./user-settings/display-name.svelte";
	import OAuthAccounts from "./user-settings/oauth-accounts.svelte";
</script>

<h2 class="text-2xl font-bold tracking-tight md:text-3xl">user settings</h2>

<div class="flex w-full flex-col gap-4 pb-4 md:gap-6">
	<DisplayName />

	<OAuthAccounts />
	<ApiKeys />
</div>
