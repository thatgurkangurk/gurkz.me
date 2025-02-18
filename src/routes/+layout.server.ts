import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	return {
		subject: event.locals.session
	};
};
