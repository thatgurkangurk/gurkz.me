import type { LayoutServerLoad } from "./$types";
import { getProjectBySlug } from "../projects/projects.js";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
	const project = getProjectBySlug(event.url.pathname.replace("/project/", ""));

	if (!project) error(404, "that project could not be found");

	return {
		project
	};
};
