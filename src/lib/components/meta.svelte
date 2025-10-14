<script lang="ts">
	type Props = {
		title: string;
	};

	let { title: titleProp }: Props = $props();

	const title = $derived(`${titleProp} - gurkan's website`);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
