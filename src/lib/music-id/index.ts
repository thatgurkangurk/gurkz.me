import type { MusicId } from "./type";
import { db } from "$lib/db";
import { musicIds } from "$lib/schema/music";
import type { User } from "$lib/user/types";
import { eq } from "drizzle-orm";

export async function createMusicId(
	data: Omit<MusicId, "created" | "id" | "working" | "createdBy">,
	user: User
) {
	if (user.permissions["canCreateMusicIds"]) {
		await db.insert(musicIds).values({
			...data
		});
	}
}

export async function deleteMusicId(id: string, user: User) {
	if (user.permissions["canManageMusicIds"]) {
		await db.delete(musicIds).where(eq(musicIds.id, id));
	}
}
