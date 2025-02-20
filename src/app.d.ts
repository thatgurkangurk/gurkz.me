// See https://svelte.dev/docs/kit/types#app.d.ts
import type { user } from "$lib/server/auth-subject";
import type { InferOutput } from "valibot";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: InferOutput<typeof user> | undefined | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		namespace Superforms {
			type Message = {
				type: "error" | "success";
				text: string;
			};
		}
	}
}

export {};
