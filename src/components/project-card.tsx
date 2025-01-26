import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { A } from "@solidjs/router";
import type { Project } from "~/lib/project";

export function ProjectCard(props: { project: Project }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.project.name}</CardTitle>
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
