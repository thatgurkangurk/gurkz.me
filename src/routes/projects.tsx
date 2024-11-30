import { For } from "solid-js";
import { ProjectCard } from "~/lib/components/project-card";
import { projects } from "~/lib/projects";

export default function Projects() {
    return (
        <>
            <h2 class="text-3xl pb-3">projects</h2>
            <div class="grid gap-2 grid-cols-2 md:grid-cols-4">
                <For each={projects}>
                    {(project) => <ProjectCard project={project} />}
                </For>
            </div>
        </>
    );
}
