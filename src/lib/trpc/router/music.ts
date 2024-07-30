import { procedure, router } from "../utils";
import { db } from "~/lib/db";

export default router({
	getMusicIds: procedure.query(async ({ ctx }) => {
		const music = await db.query.musicIds.findMany({
			with: {
				creator: true,
			},
		});

		return {
			data: music,
		};
	}),
});
