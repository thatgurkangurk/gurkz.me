import { A } from "@solidjs/router";

export function Footer() {
	return (
		<footer class="w-full flex h-16 items-center gap-4 border-t bg-background px-4 md:px-6 [grid-area:footer]">
			<div class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6">
				<p>
					this website uses cookies and analytics.{" "}
					<A class="hover:underline hover:underline-offset-4" href="/privacy">
						learn more
					</A>
				</p>
			</div>
		</footer>
	);
}
