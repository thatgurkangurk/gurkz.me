import video from "./data/video.json" with { type: "json" };
import { hydrateAndCamelCase, local, schema } from "./utils.js";

await local.transaction(async (tx) => {
	for (const rawVid of video) {
		const vid = hydrateAndCamelCase(rawVid);

		try {
			await tx.insert(schema.video).values(vid).onConflictDoNothing();
		} catch (err) {
			console.error(`Failed to insert video ID ${vid.id}:`, err);
		}
	}
});

console.log("done");
process.exit(0);
