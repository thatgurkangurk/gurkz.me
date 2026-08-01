<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from "$lib/components/ui/breadcrumb/index.js";
	import { getUsers } from "$lib/api/admin.remote";
	import UserCard from "./user-card.svelte";
	
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
			<BreadcrumbPage>users</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">all users</h1>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
	{#each await getUsers() as user}
		<UserCard {user} />
	{/each}
</div>
