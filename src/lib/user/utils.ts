import PocketBase, { ClientResponseError } from "pocketbase";
import type { User } from "./types";

export async function getUser(pb: PocketBase, id: string) {
	try {
		const record = (await pb.collection("users").getOne(id)) as User;
		return record;
	} catch (err) {
		if (err instanceof ClientResponseError) {
			if (err.status === 404) {
				return null;
			}
			console.error(err);
		}
		console.error(err);
		return null;
	}
}
