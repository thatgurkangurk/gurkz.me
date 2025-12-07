import { createServerFn } from "@tanstack/react-start";
import { authClient } from "./auth";
import { auth } from "~/server/auth";
import { getRequest } from "@tanstack/react-start/server";

export function useSession() {
	return authClient.useSession();
}

export const getServerSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: getRequest().headers,
		});

		return session;
	},
);
