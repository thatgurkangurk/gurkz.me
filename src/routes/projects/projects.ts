export type Project = {
	title: string;
	description: string;
	slug: string;
};

export const projects: Project[] = [
	{
		title: "want you gone",
		description: "portal 2's ending remade in HTML, CSS and JS",
		slug: "want-you-gone"
	}
];

export function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}
