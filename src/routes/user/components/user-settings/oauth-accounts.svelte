<script lang="ts">
	import { getLinkedAccounts } from "#lib/api/users.remote.js";
	import Button from "#lib/components/button.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "#lib/components/ui/card/index.js";
	import { useSession } from "#lib/session.svelte.js";
	import type { SocialProvider } from "better-auth";

	const session = useSession();

	const accounts = await getLinkedAccounts();

	const providers: SocialProvider[] = ["github", "discord"];
</script>

<Card class="w-full max-w-xl">
	<CardHeader>
		<CardTitle>linked accounts</CardTitle>
	</CardHeader>
	<CardContent>
		{@const accountProviderIdList = Array.from(new Set(accounts.map((acc) => acc.providerId)))}
		{@const isLastAccount = accountProviderIdList.length <= 1}

		<div class="flex flex-col gap-3">
			{#each providers as provider}
				{@const isLinked = accountProviderIdList.includes(provider)}

				<div class="flex items-center justify-between rounded-lg border p-4 shadow-sm">
					<div class="flex flex-col gap-1">
						<p class="leading-none font-medium">{provider}</p>
						<p class="text-sm text-muted-foreground">
							{isLinked ? "linked" : "not linked"}
						</p>
					</div>

					{#if isLinked}
						<Button
							variant="outline"
							disabled={isLastAccount}
							onclick={async () => {
								await session.authClient.unlinkAccount({
									providerId: provider
								});
								getLinkedAccounts().refresh();
							}}
						>
							unlink
						</Button>
					{:else}
						<Button
							onclick={async () => {
								await session.authClient.linkSocial({ provider });
							}}
						>
							link
						</Button>
					{/if}
				</div>
			{/each}
		</div>

		{#if isLastAccount && accountProviderIdList.length === 1}
			<p class="mt-4 text-xs text-muted-foreground">
				* you must have at least one linked account to sign in
			</p>
		{/if}
	</CardContent>
</Card>
