import { atom } from "nanostores";

const $animationFrames = atom<number[]>([]);

export { $animationFrames };
