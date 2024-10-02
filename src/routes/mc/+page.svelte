<script lang="ts">
	type Status = "loading" | "idle";

	let status = $state<Status>("idle");
	const isLoading = $derived(status === "loading");

	function toggleStatus() {
		if (status === "idle") {
			status = "loading";
		} else if (status === "loading") {
			status = "idle";
		}
	}
</script>

<p>aaaaaaaaa</p>
