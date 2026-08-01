<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbSeparator,
		BreadcrumbPage
	} from "$lib/components/ui/breadcrumb/index.js";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<Breadcrumb>
	<BreadcrumbList>
		<BreadcrumbItem>
			<BreadcrumbLink href="/">home</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage>admin</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">admin</h1>

<Button href={resolve("/admin/users")}>manage users</Button>
