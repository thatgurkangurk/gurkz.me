export type MetaInput = {
	title: string;
	description?: string;
	canonical?: string;
	noIndex?: boolean;
};

const DEFAULTS = {
	siteName: "gurkan's website",
	baseUrl: "https://www.gurkz.me"
};

export function defineMeta(input: MetaInput) {
	const { title, description, canonical = DEFAULTS.baseUrl, noIndex = false } = input;

	const fullTitle = `${title} - ${DEFAULTS.siteName}`;

	return {
		title: fullTitle,
		description,
		canonical,
		robots: noIndex ? "noindex, nofollow" : "index, follow"
	};
}

export type Meta = ReturnType<typeof defineMeta>;
