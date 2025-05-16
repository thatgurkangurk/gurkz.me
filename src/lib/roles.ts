import { type } from "arktype";

export const options = ["USER", "ADMIN"] as const;

export const Roles = type("===", options);

export type Role = type.infer<typeof Roles>;
