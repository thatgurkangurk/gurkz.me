// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		interface Error {
			customMessage?: string;
		}
		interface Locals {
			user: import("./lib/server/auth").User;
			session: import("./lib/server/auth").Session;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	var $client:
		| import("@orpc/server").RouterClient<typeof import("$lib/server/router").router>
		| undefined;
}

export {};
