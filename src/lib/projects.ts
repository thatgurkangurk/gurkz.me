function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
	return k in x;
}

type Projects = "WEBHOOK_DESTROYER" | "STILL_ALIVE" | "BRAINFUCK";
type Project = {
	title: string;
	description: string;
	needsJS: boolean;
	slug: string;
};

const Projects: Record<Projects, Project> = {
	WEBHOOK_DESTROYER: {
		title: "webhook destroyer",
		description: "a simple tool to destroy Discord webhooks",
		needsJS: true,
		slug: "webhook-destroyer",
	},
	STILL_ALIVE: {
		title: "still alive",
		description: "recreation of the ending credits in Portal",
		needsJS: true,
		slug: "still-alive",
	},
	BRAINFUCK: {
		title: "brainf**k interpreter",
		description: "a interpreter for the brainf**k language",
		needsJS: true,
		slug: "brainfuck"
	}
} as const;

const keys = Object.keys(Projects);

function getAllProjects() {
	const projects: Project[] = [];

	keys.forEach((key) => {
		if (isKey(Projects, key)) {
			projects.push(Projects[key]);
		}
	});

	return projects;
}

export { getAllProjects, Projects };
export type { Project };
