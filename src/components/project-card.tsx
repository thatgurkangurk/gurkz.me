import { A } from "@solidjs/router";
import type { Project } from "~/lib/projects";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function ProjectCard(props: { project: Project }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.project.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>{props.project.description}</p>
			</CardContent>
			<CardFooter>
				<A href={`/project/${props.project.slug}`}>
					<Button>open</Button>
				</A>
			</CardFooter>
		</Card>
	);
}
