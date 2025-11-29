import * as v from "valibot";
import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { CreateMusicIdSchema, EditMusicIdSchema } from "../../routes/music/forms";
import { requireAuth, requireUserPermission } from "$lib/auth.js";
import { hasPermission } from "$lib/permissions";
import { musicIds } from "$lib/server/db/schema/music";
import { eq } from "drizzle-orm";
import { musicIdListGuard } from "../../routes/music/guard.server";
import { ResultAsync } from "neverthrow";

export const listMusicIds = query(async () => {
	await musicIdListGuard();
	const ids = await db.query.musicIds.findMany({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
			working: true,
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
	await musicIdListGuard();
	const id = await db.query.musicIds.findFirst({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
			working: true,
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

export const createMusicId = form(CreateMusicIdSchema, async (input, invalid) => {
	const user = await requireUserPermission("CREATE_MUSIC_IDS");

	const result = await ResultAsync.fromPromise(
		db.insert(musicIds).values({
			createdById: user.id,
			name: input.name,
			robloxId: input.robloxId,
			tags: input.tags.map((tag) => tag.text)
		}),
		(error) => ({
			type: "db",
			error: error instanceof Error ? error : new Error(String(error))
		})
	);

	if (result.isErr()) {
		console.error("failed to create music id", result.error.error.message);
		invalid(invalid.name("could not create the music id").message);
	}

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

		const result = await ResultAsync.fromPromise(
			db.delete(musicIds).where(eq(musicIds.id, input.id)),
			(error) => ({
				type: "db",
				error: error instanceof Error ? error : new Error(String(error))
			})
		);

		if (result.isErr()) {
			console.error("failed to delete music id", result.error.error.message);
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

	if (!(isOwner || isManager)) {
		error(403, {
			message: "you are not allowed to do that"
		});
	}

	const updateResult = await ResultAsync.fromPromise(
		db.update(musicIds).set(cleanUpdates).where(eq(musicIds.id, id)).returning(),
		(error) => ({
			type: "db",
			error: error instanceof Error ? error : new Error(String(error))
		})
	);

	if (updateResult.isErr()) {
		console.error("failed to update", updateResult.error.error.message);
		error(500);
	}

	await listMusicIds().refresh();
	await getMusicId(input.id).refresh();

	return {
		success: true,
		newData: updateResult.value[0]
	};
});
