// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/user/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: import("pocketbase").default;
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
