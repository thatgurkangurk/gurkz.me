import clips from "./data/clip.json" with { type: "json" };
import { hydrateAndCamelCase, local, schema } from "./utils.js";

await local.transaction(async (tx) => {
	for (const rawClip of clips) {
		const clip = hydrateAndCamelCase(rawClip);

		try {
			const [newClip] = await tx.insert(schema.clip).values(clip).onConflictDoNothing().returning();

			if (newClip) console.log(`inserted new clip ${newClip.title}`);
		} catch (err) {
			console.error(`Failed to insert video ID ${clip.id}:`, err);
		}
	}
});

console.log("done");
process.exit(0);
