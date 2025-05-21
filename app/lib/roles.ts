import { z } from "zod/v4";

export const Roles = z.enum(["USER", "ADMIN"]);

export type Role = z.infer<typeof Roles>;
