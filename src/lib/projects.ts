type Project = {
	title: string;
	description: string;
	slug: string;
};

const projects: Project[] = [
	{
		title: "webhook destroyer",
		description: "a simple tool to destroy discord webhooks",
		slug: "/webhook-destroyer"
	}
];

function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}

export { projects, getProjectBySlug };
export type { Project };
