export type Meta = {
	title: string;
};

export function defineMeta(data: Meta) {
	return {
		...data,
		title: `${data.title} - gurkan's website`
	};
}
