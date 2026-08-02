import { defineRelations } from "drizzle-orm";
import { schema } from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	user: {
		musicIds: r.many.musicIds()
	},
	musicIds: {
		creator: r.one.user({
			from: r.musicIds.createdById,
			to: r.user.id,
			optional: false
		})
	}
}));
