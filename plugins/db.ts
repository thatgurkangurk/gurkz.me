import { db } from "#lib/server/db/index.js";
import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
    nitroApp.hooks.hook("close", async () => {
        console.log("\nclosing db");
        await db.$client.end();

        setTimeout(() => {
            // @ts-expect-error i dont have @types/node
            process.exit(0);
        }, 2000);
    });
});
