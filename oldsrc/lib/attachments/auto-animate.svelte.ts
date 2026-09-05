import { fromAction } from "svelte/attachments";
import {
	autoAnimate as autoAnimateAction,
	type AutoAnimateOptions,
	type AutoAnimationPlugin
} from "@formkit/auto-animate";

export function autoAnimate(
	config?: Partial<AutoAnimateOptions> | AutoAnimationPlugin | undefined
) {
	return fromAction(autoAnimateAction, () => config);
}
