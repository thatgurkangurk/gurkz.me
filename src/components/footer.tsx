import { A } from "@solidjs/router";

export function Footer() {
	return (
		<div class="text-center">
			<hr class="h-1 rounded-md border-0 bg-themeGray" />

			<footer class="pt-2 [grid-area:footer]">
				this website doesn't steal your information
				<br />
				have a nice day :)
				<br />
				<A href="/privacy" class="text-themeColor underline">
					read more
				</A>
			</footer>
		</div>
	);
}
