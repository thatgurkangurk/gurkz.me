type Project = {
	title: string;
	description: string;
	slug: string;
	reload?: boolean;
};

const projects: Project[] = [
	{
		title: "webhook destroyer",
		description: "a simple tool to destroy discord webhooks",
		slug: "/webhook-destroyer"
	},
	{
		title: "still alive",
		description: "still alive recreated in HTML,CSS and JS",
		slug: "/still-alive"
	},
	{
		title: "want you gone",
		description: "want you gone in HTML, CSS and JS",
		slug: "/want-you-gone"
	}
];

function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}

export { projects, getProjectBySlug };
export type { Project };
