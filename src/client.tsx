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
        if (msg.includes("418") || msg.includes("Hydration")) {
            console.group(
                "%cTHERES A MISMATCH!",
                "background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
            );

            const targetNode =
                event.target instanceof HTMLElement
                    ? event.target
                    : document.body;

            const fiberKey = Object.keys(targetNode).find((key) =>
                key.startsWith("__reactFiber$"),
            );
            const fiber = fiberKey
                ? (targetNode as unknown as Record<string, unknown>)[fiberKey]
                : null;

            let currentFiber = fiber as {
                type?: { name?: string; displayName?: string };
                return?: unknown;
            } | null;
            let componentName = "Unknown";
            while (currentFiber) {
                if (
                    typeof currentFiber.type === "function" ||
                    typeof currentFiber.type === "object"
                ) {
                    const name =
                        currentFiber.type?.displayName ||
                        currentFiber.type?.name;
                    if (name) {
                        componentName = name;
                        break;
                    }
                }
                currentFiber = currentFiber.return as typeof currentFiber;
            }

            console.log(
                "%cTarget Node:",
                "color: #ff9900; font-weight: bold;",
                targetNode,
            );
            console.log(
                "%cCulprit Component:",
                "color: #00ff66; font-weight: bold;",
                componentName,
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
