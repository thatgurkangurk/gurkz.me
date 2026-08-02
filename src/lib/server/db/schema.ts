import * as auth from "./schema/auth.js";
import * as clip from "./schema/clip.js";
import * as music from "./schema/music.js";
import * as permission from "./schema/permission.js";
import * as profile from "./schema/profile.js";
import * as video from "./schema/video.js";

export * from "./schema/auth.js";
export * from "./schema/clip.js";
export * from "./schema/music.js";
export * from "./schema/permission.js";
export * from "./schema/profile.js";
export * from "./schema/video.js";

export const schema = {
	...auth,
	...clip,
	...music,
	...permission,
	...profile,
	...video
};
