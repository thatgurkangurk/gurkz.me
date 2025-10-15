import * as v from "valibot";
import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { CreateMusicIdSchema, EditMusicIdSchema } from "../../routes/music/forms";
import { requireAuth, requireUserPermission } from "$lib/auth.js";
import { hasPermission } from "$lib/permissions";
import { musicIds } from "$lib/server/db/schema/music";
import { eq } from "drizzle-orm";

export const listMusicIds = query(async () => {
	console.debug("fetching music ids");
	const ids = await db.query.musicIds.findMany({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
			working: true,
			verified: true,
			tags: true
		},
		with: {
			creator: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		},
		orderBy: ({ id }, { desc }) => desc(id)
	});
	return ids;
});

/**
 * not really used yet, but it might be later
 */
export const getMusicId = query(v.string(), async (input) => {
	const id = await db.query.musicIds.findFirst({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
			working: true,
			verified: true,
			tags: true
		},
		with: {
			creator: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		},
		where: (table, { eq }) => eq(table.id, input)
	});

	if (!id) {
		error(404, "not found");
	}

	return id;
});

/**
 * this is a command for now until i can figure out how to integrate formisch with remote functions
 */
export const createMusicId = command(CreateMusicIdSchema, async (input) => {
	const user = await requireUserPermission("CREATE_MUSIC_IDS");

	await db
		.insert(musicIds)
		.values({
			verified: hasPermission(user, "CREATE_AUTO_VERIFIED_MUSIC_IDS") ? true : false,
			createdById: user.id,
			name: input.name,
			robloxId: input.robloxId,
			tags: input.tags
		})
		.catch((err) => {
			console.error(err);
			error(500, {
				message: "could not create the music id"
			});
		});

	await listMusicIds().refresh();

	return {
		text: "successfully created the music id",
		type: "success"
	};
});

/**
 * this is a command for now until i can figure out how to integrate formisch with remote functions
 */
export const deleteMusicId = command(
	v.object({
		id: v.pipe(v.string(), v.ulid())
	}),
	async (input) => {
		const user = await requireAuth();

		const [musicIdToDelete] = await db
			.select()
			.from(musicIds)
			.where(eq(musicIds.id, input.id))
			.limit(1);

		if (!musicIdToDelete)
			error(404, {
				message: `Music ID ${input.id} not found`
			});

		const canManage =
			!!user &&
			(user.id === musicIdToDelete.createdById || hasPermission(user, "MANAGE_MUSIC_IDS"));

		if (!canManage)
			error(403, {
				message: "you are not allowed to do that"
			});

		try {
			await db.delete(musicIds).where(eq(musicIds.id, input.id));
		} catch (err) {
			console.error("FAILED TO DELETE", err);
			error(500);
		}

		await listMusicIds().refresh();

		return {
			success: true
		};
	}
);

/**
 * this is a command for now until i can figure out how to integrate formisch with remote functions
 */
export const editMusicId = command(EditMusicIdSchema, async (input) => {
	const user = await requireAuth();
	const { id, ...updates } = input;
	const cleanUpdates = Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(updates).filter(([_, v]) => v !== undefined)
	);
	const [musicIdToEdit] = await db.select().from(musicIds).where(eq(musicIds.id, id)).limit(1);

	if (!musicIdToEdit)
		error(404, {
			message: `Music ID ${id} not found`
		});

	const isOwner = user.id === musicIdToEdit.createdById;
	const isManager = user && hasPermission(user, "MANAGE_MUSIC_IDS");

	if (
		"verified" in cleanUpdates &&
		cleanUpdates.verified !== musicIdToEdit.verified &&
		!isManager
	) {
		error(403, {
			message: "you are not allowed to change the verified status"
		});
	}

	if (!(isOwner || isManager)) {
		error(403, {
			message: "you are not allowed to do that"
		});
	}

	try {
		await db.update(musicIds).set(cleanUpdates).where(eq(musicIds.id, id));
	} catch (err) {
		console.error("FAILED TO UPDATE", err);
		error(500);
	}

	await listMusicIds().refresh();

	return {
		success: true
	};
});
