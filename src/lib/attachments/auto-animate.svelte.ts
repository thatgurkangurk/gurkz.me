import {
	type AutoAnimateOptions,
	type AutoAnimationPlugin,
	autoAnimate as autoAnimateAction
} from "@formkit/auto-animate";
import { fromAction } from "svelte/attachments";

export function autoAnimate(
	config?: Partial<AutoAnimateOptions> | AutoAnimationPlugin | undefined
) {
	return fromAction(autoAnimateAction, () => config);
}
