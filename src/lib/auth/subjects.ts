import { createSubjects } from "@openauthjs/openauth/subject";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { getDB } from "~/server/db";
import { users } from "~/server/schema/user";

export const subjects = createSubjects({
	user: z.object({
		id: z.string(),
		username: z.string()
	})
});

export async function getOrCreateUser({ id, username }: { id: string; username: string }) {
	"use server";
	const db = getDB();
	const user = await db.transaction(async (tx) => {
		const result = await tx.query.users.findFirst({
			where: eq(users.id, id)
		});

		if (!result) {
			const [newUser] = await tx
				.insert(users)
				.values({
					id: id,
					name: username
				})
				.returning();

			return newUser;
		}

		return result;
	});

	return user;
}
