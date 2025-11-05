<script lang="ts">
	import { getUserById, manageUserPermissions } from "$lib/api/admin.remote.js";
	import { Permissions, permissions, type Permission } from "$lib/permissions.js";
	import type { PageProps } from "./$types";
	import { Button } from "$lib/components/ui/button";
	import { createForm, Field, Form, reset } from "@formisch/svelte";
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import * as v from "valibot";

	let { data, params }: PageProps = $props();

	const formSchema = v.object({
		permissions: v.array(Permissions)
	});

	const user = $derived(await getUserById({ userId: params.userId }));

	const form = createForm({
		schema: formSchema,
		initialInput: {
			// svelte-ignore state_referenced_locally
			permissions: user.permissions as Permission[]
		}
	});
</script>

<Button href="/admin">
	<ArrowLeft />
	back
</Button>

<h1 class="text-3xl">managing "{user.name}"</h1>

<p>user permissions:</p>
<Form
	of={form}
	onsubmit={async ({ permissions }) => {
		const res = await manageUserPermissions({
			userId: user.id,
			permissions: permissions
		});

		if (res.error) {
			console.error("something went wrong: ", res.error);
			return;
		}

		reset(form, {
			initialInput: {
				permissions: res.user?.permissions as Permission[]
			}
		});
	}}
>
	{#each permissions as permission}
		<Field of={form} path={["permissions"]}>
			{#snippet children(field)}
				<label class="flex cursor-pointer items-center gap-2 select-none">
					<input
						{...field.props}
						type="checkbox"
						value={permission}
						checked={field.input?.includes(permission)}
					/>
					{permission}
				</label>
			{/snippet}
		</Field>
	{/each}
	<Button type="submit" disabled={form.isSubmitting}>
		{form.isSubmitting ? "saving..." : "save"}
	</Button>
</Form>
