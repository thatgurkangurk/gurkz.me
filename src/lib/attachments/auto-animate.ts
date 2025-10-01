import { fromAction } from "svelte/attachments";
import autoAnimateAction, {
	type AutoAnimateOptions,
	type AutoAnimationPlugin
} from "@formkit/auto-animate";

export const autoAnimate = (config: Partial<AutoAnimateOptions> | AutoAnimationPlugin = {}) =>
	fromAction(autoAnimateAction, () => config);
