import { z } from "zod";

export const permissionsSchema = z.enum([
    "DEFAULT",
    "CREATE_MUSIC_IDS",
    "MANAGE_MUSIC_IDS",
    "CREATE_SHORT_LINKS",
]);

export type Permission = z.infer<typeof permissionsSchema>;
