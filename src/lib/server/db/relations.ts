import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	accounts: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id
		})
	},
	users: {
		accounts: r.many.account(),
		musicIds: r.many.musicIds(),
		sessions: r.many.session()
	},
	musicIds: {
		creator: r.one.user({
			from: r.musicIds.createdById,
			to: r.user.id,
			optional: false
		})
	},
	sessions: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id
		})
	}
}));
