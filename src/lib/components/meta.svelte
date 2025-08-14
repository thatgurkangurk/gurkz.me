<script lang="ts" module>
	export type Props = {
		title: string;
	};
</script>

<script lang="ts">
	let { title }: Props = $props();
</script>

<svelte:head>
	<title>{title} - gurkan's website</title>
</svelte:head>
