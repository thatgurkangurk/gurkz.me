import { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import { getDB } from "../db";

export async function createContext() {
	return {
		db: getDB()
	};
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;
