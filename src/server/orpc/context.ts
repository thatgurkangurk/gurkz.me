import { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import { db } from "../../../app/server/db";

export async function createContext() {
	return {
		db: db
	};
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;
