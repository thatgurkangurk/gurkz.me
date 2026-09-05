import { db } from "#lib/server/db/index.js";
import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
    nitroApp.hooks.hook("close", async () => {
        console.log("closing db");
        await db.$client.end();
    });
});
