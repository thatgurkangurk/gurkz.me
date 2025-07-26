import { createAuthClient } from "better-auth/svelte";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./server/auth";

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>()]
});
