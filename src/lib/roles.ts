import { z } from "zod";

export const rolesSchema = z.enum(["USER", "ADMIN"]);

export type Role = z.infer<typeof rolesSchema>;
