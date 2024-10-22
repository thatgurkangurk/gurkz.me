import { getProjectBySlug } from "$lib/projects";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	const project = getProjectBySlug(event.url.pathname.replace("/project/", ""));

	if (!project) error(404, "that project could not be found");

	return {
		project,
	};
};
