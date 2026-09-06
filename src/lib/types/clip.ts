export type Clip = {
	id: string;
	createdAt: Date;
	createdById: string;
	videoId: string;
	url: string;
	title: string;
	selected: boolean;
	overriddenProfileDataId: string | null;
	songs: string[];
	creator: {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image: string | null;
		createdAt: Date;
		updatedAt: Date;
		username: string;
		admin: boolean;
	} | null;
	note: string | null;
};
