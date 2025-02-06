import { createClient } from "@openauthjs/openauth/client";
import { env } from "~/env";

export const client = createClient({
    clientID: env.PASSPORT_CLIENT_ID,
    issuer: env.REMOTE_AUTH_HOST,
});
