import { A, redirect, useLocation } from "@solidjs/router";
import { ArrowLeftIcon } from "lucide-solid";
import type { ParentProps } from "solid-js";
import { Button } from "~/components/ui/button";
import { getProjectBySlug } from "~/lib/projects";

export default function ProjectLayout(props: ParentProps) {
	const location = useLocation();

	const project = getProjectBySlug(location.pathname.replace("/project/", ""));

	if (!project) return redirect("/projects");

	return (
		<>
			<A href="/projects">
				<Button>
					<ArrowLeftIcon class="mr-2 h-6 w-6" /> back
				</Button>
			</A>
			<h2 class="text-3xl">{project.title}</h2>
			<p>{project.description}</p>
			{props.children}
		</>
	);
}