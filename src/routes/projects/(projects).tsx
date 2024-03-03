import { A } from "@solidjs/router";

export default function Projects() {
	return (
		<>
			<h1 class="pt-2 text-4xl">projects</h1>
			<ul class="flex flex-col gap-1.5">
				<li>
					<A href="/project/badapple">bad apple in HTML</A>
				</li>
				<li>
					<A href="/project/webhook-destroyer">webhook destroyer</A>
				</li>
				<li>
					<A href="/project/most-beautiful-pokemon">most beautiful pokémon</A>
				</li>
			</ul>
		</>
	);
}
