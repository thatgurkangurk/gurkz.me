import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema/user";

export async function getOrCreateUser(id: string, username: string) {
	"use server";
	const user = await db.transaction(async (tx) => {
		const result = await tx.query.users.findFirst({ where: eq(users.id, id) });

		if (!result) {
			const [newUser] = await tx.insert(users).values({ id: id, name: username }).returning();

			return newUser;
		}

		return result;
	});

	return user;
}
