import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function properCase(string: string): string {
    return string.replace(/^\w/, (match) => match.toUpperCase());
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
