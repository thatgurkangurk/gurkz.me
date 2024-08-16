/// <reference types="@solidjs/start/env" />
import type { Session, User } from "lucia";

declare module "@solidjs/start/server" {
	export interface RequestEventLocals {
		user?: User | null;
		session?: Session | null;
	}
}

declare global {
	interface Window {
		umami: {
			track(input: string | object): void;
		};
	}
}
