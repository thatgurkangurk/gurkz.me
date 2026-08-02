import * as auth from "./schema/auth.js";
import * as music from "./schema/music.js";
import * as permission from "./schema/permission.js";

export * from "./schema/auth.js";
export * from "./schema/music.js";
export * from "./schema/permission.js";

export const schema = {
	...auth,
	...music,
	...permission
};
