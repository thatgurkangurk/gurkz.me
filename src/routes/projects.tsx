import { For } from "solid-js";
import { ProjectCard } from "~/components/project-card";
import { projects } from "~/lib/project";

export default function Projects() {
    return (
        <>
            <h1 class="text-3xl pb-3">projects</h1>
            <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
                <For each={projects}>
                    {(project) => <ProjectCard project={project} />}
                </For>
            </div>
        </>
    );
}
