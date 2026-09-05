<script lang="ts">
	import { getUserById, setUserPermissions } from "#lib/api/admin.remote.js";
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from "#lib/components/ui/breadcrumb/index.js";
	import type { PageProps } from "./$types";
	import { Avatar, AvatarFallback, AvatarImage } from "#lib/components/ui/avatar/index.js";
	import { getInitials } from "#lib/utils/initials.js";
	import { configureForm } from "#lib/remote-form.svelte.js";
	import { nonDefaultPermissions, SetUserPermissions, type NonDefaultPermission } from "./schemas";
	import { toast } from "svelte-sonner";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import Button from "#lib/components/button.svelte";

	type Props = {};

	let { params }: PageProps = $props();

	const user = $derived(await getUserById(params.userId));

	let formEl: HTMLFormElement | undefined = $state.raw();

	const configured = configureForm(() => ({
		form: setUserPermissions,
		formEl,
		schema: SetUserPermissions,
		navBlockMessage: "you have unsaved changes. are you sure?",
		onresult: ({ success, error }) => {
			if (success) {
				toast.success("successfully submitted");
			} else if (error) {
				toast.error(error);
			}
		}
	}));

	const { form, submitting } = $derived(configured());
</script>

<Breadcrumb>
	<BreadcrumbList>
		<BreadcrumbItem>
			<BreadcrumbLink href="/">home</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbLink href="/admin">admin</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbLink href="/admin/users">users</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage>{user.name}</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<div class="mx-auto max-w-2xl space-y-6">
	<div class="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm">
		<Avatar class="h-16 w-16 border">
			<AvatarImage src={user.image} alt="{user.name} profile picture" />
			<AvatarFallback class="text-lg font-semibold">{getInitials(user.name)}</AvatarFallback>
		</Avatar>

		<div class="space-y-1">
			<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{user.name}</h1>
			<p class="text-sm text-muted-foreground">manage permissions for this user</p>
		</div>
	</div>

	<form
		{...form}
		bind:this={formEl}
		class="rounded-xl border bg-card text-card-foreground shadow-sm"
	>
		<input {...form.fields.userId.as("hidden", user.id)} />

		<div class="border-b p-6">
			<h2 class="text-lg font-semibold tracking-tight">permissions</h2>
			<p class="text-sm text-muted-foreground">toggle the permissions granted to this account</p>
		</div>

		<div class="grid gap-3 p-6 sm:grid-cols-2">
			{#each nonDefaultPermissions as permission}
				{@render permissionCheckbox(permission)}
			{/each}
		</div>

		<div class="flex items-center justify-end border-t bg-muted/30 p-4 px-6">
			<Button loading={submitting} disabled={submitting} type="submit" class="min-w-30">
				save
			</Button>
		</div>
	</form>
</div>

{#snippet permissionCheckbox(permission: NonDefaultPermission)}
	{const field = form.fields[permission].as("checkbox", user.permissions.includes(permission))}

	<label
		for={field.name}
		class="flex cursor-pointer items-center justify-between rounded-lg border bg-background p-4 shadow-sm transition-colors hover:bg-accent/50 has-checked:border-primary has-checked:bg-primary/5"
	>
		<div class="space-y-0.5 pr-2">
			<Label for={field.name} class="cursor-pointer font-medium capitalize">
				{permission.replace(/_/g, " ")}
			</Label>
		</div>
		<Checkbox {...field} id={field.name} type="button" />
	</label>
{/snippet}
