import accounts from "./data/account.json" with { type: "json" };
import { local } from "../src/lib/server/db/index.js";
import { schema } from "../src/lib/server/db/schema.js";
import { hydrateAndCamelCase } from "./utils.js";
import { InferSelectModel } from "drizzle-orm";

await local.transaction(async (tx) => {
	for (const rawAccount of accounts) {
		const hydratedAccount = hydrateAndCamelCase(rawAccount) as InferSelectModel<
			typeof schema.account
		>;

		const user = await tx.query.user.findFirst({
			where: {
				id: hydratedAccount.userId
			}
		});

		if (!user) {
			console.error(`NO USER FOR USER ID ${hydratedAccount.userId}`);
			tx.rollback();
		}

		const [newAccount] = await tx
			.insert(schema.account)
			.values(hydratedAccount)
			.onConflictDoNothing()
			.returning();

		if (newAccount) console.log("inserted account for " + newAccount?.userId);
	}
});

console.log("done");
process.exit(0);
