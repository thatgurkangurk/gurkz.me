import apikeys from "./data/apikey.json" with { type: "json" };
import { hydrateAndCamelCase, local, schema } from "./utils.js";

await local.transaction(async (tx) => {
	for (const rawApikey of apikeys) {
		try {
			const apikey = hydrateAndCamelCase(rawApikey) as typeof rawApikey;
			const [newApikey] = await tx
				.insert(schema.apikey)
				.values(apikey)
				.onConflictDoNothing()
				.returning();

			if (newApikey) console.log(`inserted new api key ${newApikey.name} - ${newApikey.id}`);
		} catch (err) {
			console.error(`Failed to insert api key ID ${apikey.id}:`, err);
		}
	}
});

console.log("done");
process.exit(0);
