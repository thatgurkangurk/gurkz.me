import { type ChangeEvent, useId, type InputHTMLAttributes } from "react";
import {
    type Atom,
    atom,
    useAtomValue,
    useSetAtom,
    type PrimitiveAtom,
} from "jotai";

import { Input } from "#lib/components/ui/input.js";
import { Label } from "#lib/components/ui/label.js";
import { IconSearch, IconLoader, IconX } from "@tabler/icons-react";
import type { DebouncedWriter } from "#lib/util/debounced-atom.js";

const defaultLoadingAtom = atom(false);

export type SearchInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
> & {
    label?: string;
    inputAtom: PrimitiveAtom<string>;
    writeAtom: DebouncedWriter;
    isLoading?: boolean | Atom<boolean>;
};

function useBooleanOrAtom(value: boolean | Atom<boolean> = false): boolean {
    const isAtom =
        typeof value === "object" && value !== null && "read" in value;
    const atomValue = useAtomValue(isAtom ? value : defaultLoadingAtom);
    return isAtom ? atomValue : (value as boolean);
}

export function Search({
    label = "search",
    inputAtom,
    writeAtom,
    isLoading = false,
    placeholder = "search...",
    id,
    ...props
}: SearchInputProps) {
    const isLoadingValue = useBooleanOrAtom(isLoading);
    const generatedId = useId();
    const inputId = id || generatedId;

    const value = useAtomValue(inputAtom);
    const setValue = useSetAtom(writeAtom);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        setValue("");
    };

    return (
        <div className="max-w-sm space-y-2">
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <div className="relative flex items-center">
                <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />

                <Input
                    id={inputId}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="pl-10 pr-10 transition-shadow duration-200 focus-visible:ring-2"
                    {...props}
                />

                <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center">
                    {isLoadingValue ? (
                        <IconLoader className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : value ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:scale-110 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <IconX className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">clear search</span>
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
