/// <reference types="@solidjs/start/env" />
import type { User, Session } from "lucia";

declare module "@solidjs/start/server" {
	export interface RequestEventLocals {
		user?: User | null;
		session?: Session | null;
	}
}
