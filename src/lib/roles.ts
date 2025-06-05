import { z } from "zod/v4";

export const options = ["USER", "ADMIN"] as const;

export const Roles = z.enum(options);

export type Role = z.infer<typeof Roles>;
