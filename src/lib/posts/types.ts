import type { User } from "$lib/user/types";

export type Post = {
	author: string;
	collectionId: string;
	collectionName: string;
	content: string;
	created: Date;
	updated: Date;
	id: string;
	slug: string;
	title: string;
	expand: {
		author: User;
	};
};
