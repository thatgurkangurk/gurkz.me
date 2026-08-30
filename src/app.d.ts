// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="vite-plugin-simple-scope/types" />

import type { Session, User } from "#lib/auth.js";
import type { Meta } from "#lib/meta.js";

declare global {
	namespace App {
		namespace Superforms {
			type Message = {
				type: "error" | "success" | "warning";
				title: string;
				text: string;
			};
		}

		// interface Error {}
		interface Locals {
			user?: User;
			session?: Session;
		}
		interface PageData {
			meta?: Meta;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
