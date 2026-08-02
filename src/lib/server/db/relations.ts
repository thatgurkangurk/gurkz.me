import { defineRelations } from "drizzle-orm";
import { schema } from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	user: {
		musicIds: r.many.musicIds(),
		clips: r.many.clip()
	},
	clip: {
		creator: r.one.user({
			from: r.clip.createdById,
			to: r.user.id
		}),
		video: r.one.video({
			from: r.clip.videoId,
			to: r.video.id
		}),
		overriddenProfileData: r.one.profile({
			optional: true,
			from: r.clip.overriddenProfileDataId,
			to: r.profile.id
		})
	},
	video: {
		clips: r.many.clip()
	},
	musicIds: {
		creator: r.one.user({
			from: r.musicIds.createdById,
			to: r.user.id,
			optional: false
		})
	}
}));
