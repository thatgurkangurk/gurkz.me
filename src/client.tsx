import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

if (typeof window !== "undefined") {
    const originalError = console.error;
    console.error = function (...args) {
        const errorString = args
            .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg),
            )
            .join(" ");
        if (
            errorString.includes("418") ||
            errorString.includes("Hydration") ||
            errorString.includes("Text content does not match") ||
            errorString.includes("did not match")
        ) {
            console.group(
                "%cTHERES A MISMATCH!",
                "background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
            );
            console.log(
                "%craw args:",
                "color: #ff9900; font-weight: bold;",
                args,
            );
            console.log(
                "%clive dom snapshot:",
                "color: #00ff66; font-weight: bold;",
                document.body.innerHTML,
            );
            console.groupEnd();
        }
        originalError.apply(console, args);
    };

    window.addEventListener("error", (event) => {
        const err = event.error;
        const msg = event.message || err?.message || "";
        if (
            msg.includes("418") ||
            msg.includes("Hydration") ||
            msg.includes("Text content does not match") ||
            msg.includes("did not match")
        ) {
            console.group(
                "%cTHERES A MISMATCH!!!!!!",
                "background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
            );
            console.log(
                "%cerror object:",
                "color: #ff9900; font-weight: bold;",
                err,
            );
            console.log(
                "%clive dom snapshot:",
                "color: #00ff66; font-weight: bold;",
                document.body.innerHTML,
            );
            console.groupEnd();
        }
    });
}

hydrateRoot(
    document,
    <StrictMode>
        <StartClient />
    </StrictMode>,
);
