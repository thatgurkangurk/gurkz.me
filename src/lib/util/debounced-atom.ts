import { atom, PrimitiveAtom, WritableAtom, Atom } from "jotai";

export type DebouncedWriter = WritableAtom<null, [string], void>;

export type DebouncedAtoms = {
    inputAtom: PrimitiveAtom<string>;
    debouncedAtom: PrimitiveAtom<string>;
    isDebouncingAtom: Atom<boolean>;
    writeAtom: DebouncedWriter;
};

export function createDebouncedAtom(
    initialValue: string = "",
    delay: number = 300,
): DebouncedAtoms {
    const inputAtom = atom<string>(initialValue);
    const debouncedAtom = atom<string>(initialValue);

    const isDebouncingAtom = atom(
        (get) => get(inputAtom) !== get(debouncedAtom),
    );

    let timer: ReturnType<typeof setTimeout>;

    const writeAtom = atom(null, (_get, set, update: string) => {
        set(inputAtom, update);
        clearTimeout(timer);
        timer = setTimeout(() => {
            set(debouncedAtom, update);
        }, delay);
    });

    return { inputAtom, debouncedAtom, writeAtom, isDebouncingAtom };
}
