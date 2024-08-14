type Project = {
	title: string;
	description: string;
	slug: string;
};

const projects: Project[] = [
	{
		title: "want you gone",
		description: "portal 2's ending remade in HTML, CSS and JS",
		slug: "want-you-gone",
	},
	// ,
	// {
	// 	title: "webhook destroyer",
	// 	description: "a simple tool to destroy discord webhooks",
	// 	slug: "webhook-destroyer",
	// },
	// {
	// 	title: "bad apple",
	// 	description: "bad apple in HTML",
	// 	slug: "bad-apple",
	// },
];

function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}

export type { Project };
export { projects, getProjectBySlug };
