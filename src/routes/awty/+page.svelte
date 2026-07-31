<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Progress } from "$lib/components/ui/progress";
	import { Badge } from "$lib/components/ui/badge";
	import type { ModpackCheckReport } from "@thatgurkangurk/awty";

	let mode = $state<"packwiz" | "list">("packwiz");
	let targetVersion = $state("26.2");
	let packUrl = $state("");
	let rawModList = $state("");

	let useProxy = $state(true);
	let proxyUrl = $state("https://cors.gurkz.me?url=");

	let isLoading = $state(false);
	let statusMessage = $state<string | null>(null);
	let error = $state<string | null>(null);
	let report = $state<ModpackCheckReport | null>(null);

	let formattedPercentage = $derived(report ? Math.round(report.percentage_supported) : 0);

	async function handleCheck(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		error = null;
		report = null;

		try {
			statusMessage = "loading engine...";
			const { check_packwiz_wasm, check_mod_list_wasm } = await import("@thatgurkangurk/awty");

			statusMessage = "checking...";

			if (mode === "packwiz") {
				if (!packUrl.trim()) throw new Error("please enter a valid pack.toml URL");

				const activeProxy = useProxy && proxyUrl.trim() ? proxyUrl.trim() : null;

				report = await check_packwiz_wasm(packUrl.trim(), targetVersion.trim(), activeProxy);
			} else {
				const ids = rawModList
					.split(/[\n,]+/)
					.map((s) => s.trim())
					.filter(Boolean);

				if (ids.length === 0) throw new Error("please enter at least one mod id");

				report = await check_mod_list_wasm(ids, targetVersion.trim());
			}
		} catch (err: any) {
			error = err?.message || String(err) || "failed to complete version check.";
		} finally {
			isLoading = false;
			statusMessage = null;
		}
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<header class="mb-8">
		<h1 class="text-2xl font-bold tracking-tight text-foreground">are we there yet?</h1>
		<p class="mt-1 text-sm text-muted-foreground">check if your minecraft mods are updated yet</p>
	</header>

	<Card.Root class="border-border/80 shadow-sm">
		<Card.Content class="pt-6">
			<Tabs.Root value={mode} onValueChange={(v) => (mode = v as "packwiz" | "list")}>
				<Tabs.List class="mb-6 grid w-full grid-cols-2">
					<Tabs.Trigger value="packwiz">packwiz URL</Tabs.Trigger>
					<Tabs.Trigger value="list">mod id list</Tabs.Trigger>
				</Tabs.List>

				<form onsubmit={handleCheck} class="space-y-5">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div class="space-y-2 md:col-span-1">
							<Label for="targetVersion">target version</Label>
							<Input
								id="targetVersion"
								type="text"
								bind:value={targetVersion}
								placeholder="26.2"
								required
								disabled={isLoading}
							/>
						</div>

						{#if mode === "packwiz"}
							<div class="space-y-2 md:col-span-2">
								<Label for="packUrl">pack.toml URL</Label>
								<Input
									id="packUrl"
									type="url"
									bind:value={packUrl}
									placeholder="https://raw.githubusercontent.com/.../pack.toml"
									required
									disabled={isLoading}
								/>
							</div>
						{:else}
							<div class="space-y-2 md:col-span-2">
								<Label for="modList">modrinth mod ids or slugs</Label>
								<Textarea
									id="modList"
									rows={3}
									bind:value={rawModList}
									placeholder="sodium&#10;iris&#10;lithium"
									required
									disabled={isLoading}
								/>
							</div>
						{/if}
					</div>

					{#if mode === "packwiz"}
						<div class="space-y-3 rounded-lg border border-border bg-muted/30 p-3.5">
							<div class="flex items-center space-x-2">
								<Checkbox id="useProxy" bind:checked={useProxy} disabled={isLoading} />
								<Label for="useProxy" class="cursor-pointer text-xs font-medium">
									use CORS proxy (needed in browser)
								</Label>
							</div>

							{#if useProxy}
								<Input
									type="text"
									class="h-8 font-mono text-xs"
									bind:value={proxyUrl}
									placeholder="https://cors.gurkz.me?url="
									disabled={isLoading}
								/>
							{/if}
						</div>
					{/if}

					<Button type="submit" class="w-full" disabled={isLoading}>
						{#if isLoading}
							{statusMessage}
						{:else}
							check compatibility
						{/if}
					</Button>
				</form>
			</Tabs.Root>

			{#if error}
				<div
					class="mt-6 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
				>
					{error}
				</div>
			{/if}

			{#if report}
				<div class="mt-8 space-y-6 border-t border-border pt-6">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-lg font-semibold tracking-tight">results</h2>
							<p class="mt-0.5 text-xs text-muted-foreground">
								minecraft {report.target_minecraft_version}
							</p>
						</div>
						<div class="text-right">
							<span class="font-mono text-xl font-bold">
								{report.supported_mods_count} / {report.total_mods}
							</span>
							<p class="text-xs text-muted-foreground">{formattedPercentage}% ready</p>
						</div>
					</div>

					<Progress value={report.percentage_supported} class="h-2" />

					<div class="overflow-hidden rounded-md border border-border">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>mod</Table.Head>
									<Table.Head>status</Table.Head>
									<Table.Head class="text-right">latest version</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each report.mods as mod}
									<Table.Row>
										<Table.Cell class="font-medium">
											{#if mod.modrinth_url}
												<a
													href={mod.modrinth_url}
													target="_blank"
													rel="noopener noreferrer"
													class="underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground"
												>
													{mod.name || mod.id}
												</a>
											{:else}
												<span>{mod.name || mod.id}</span>
											{/if}
											{#if mod.name && mod.name !== mod.id}
												<span class="ml-1 text-xs font-normal text-muted-foreground">
													({mod.id})
												</span>
											{/if}
										</Table.Cell>
										<Table.Cell>
											{#if mod.supports_target_version}
												<Badge
													variant="secondary"
													class="border-0 bg-emerald-500/10 font-normal text-emerald-600 dark:text-emerald-400"
												>
													compatible
												</Badge>
											{:else}
												<Badge
													variant="secondary"
													class="border-0 bg-destructive/10 font-normal text-destructive"
												>
													incompatible
												</Badge>
											{/if}
										</Table.Cell>
										<Table.Cell class="text-right font-mono text-xs text-muted-foreground">
											{mod.latest_supported_version || "—"}
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
