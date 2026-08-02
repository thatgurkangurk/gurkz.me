import users from "./data/user.json" with { type: "json" };
import { local } from "../src/lib/server/db/index.js";
import { schema } from "../src/lib/server/db/schema.js";
import { hydrateAndCamelCase } from "./utils.js";

await local.transaction(async (tx) => {
	for (const rawUser of users) {
		try {
			const hydratedUser = hydrateAndCamelCase(rawUser);
			const [newUser] = await tx
				.insert(schema.user)
				.values(hydratedUser)
				.onConflictDoNothing()
				.returning();

			console.log("inserted " + newUser?.username);
		} catch (err) {
			console.error(err);
		}
	}
});

console.log("done");
process.exit(0);
