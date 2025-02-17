import * as v from "valibot";

export const rolesSchema = v.picklist(["USER", "ADMIN"]);

export type Role = v.InferOutput<typeof rolesSchema>;
