import * as v from "valibot";

export const user = v.object({ id: v.string(), username: v.string() });

export const subjects = { user: user };
