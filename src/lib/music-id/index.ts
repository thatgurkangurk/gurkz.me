import PocketBase from "pocketbase";
import type { MusicId } from "./type";

export async function getMusicId(pb: PocketBase, id: string) {
	const record = await pb.collection("music_ids").getOne<MusicId>(id, {
		expand: "owner"
	});

	return record;
}

export async function getMusicIds(pb: PocketBase, page = 1) {
	const record = await pb.collection("music_ids").getList<MusicId>(page, 14, {
		expand: "owner"
	});

	return record;
}

export async function createMusicId(
	pb: PocketBase,
	data: Omit<MusicId, "created" | "updated" | "id" | "working" | "expand">
) {
	await pb.collection("music_ids").create<MusicId>(data, {
		expand: "owner"
	});
}

export async function deleteMusicId(pb: PocketBase, id: string) {
	await pb.collection("music_ids").delete(id);
}
