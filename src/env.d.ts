/// <reference types="simple-stack-form/types" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        user: import("~/lib/auth").User | null;
        session: import("~/lib/auth").Session | null;
    }
}
