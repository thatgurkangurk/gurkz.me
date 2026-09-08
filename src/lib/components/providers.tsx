import type { DehydratedState, Permix } from "permix";
import { PermixHydrate, PermixProvider } from "permix/react";
import { useLayoutEffect } from "react";

import type { Session, User } from "#lib/server/auth.js";
import type { PermissionsDefinition } from "#lib/permix.js";
import { getRules } from "#lib/permix.js";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

function ClientRulesSetup({
    permix,
    state,
    session,
    children,
}: {
    permix: Permix<PermissionsDefinition>;
    state: DehydratedState<PermissionsDefinition>;
    session: { session: Session; user: User } | null;
    children: React.ReactNode;
}) {
    useLayoutEffect(() => {
        permix.setup(getRules(session?.user));
    }, [permix, state, session]);

    return children;
}

export function Providers({
    permix,
    state,
    session,
    children,
}: {
    permix: Permix<PermissionsDefinition>;
    state: DehydratedState<PermissionsDefinition>;
    session: { session: Session; user: User } | null;
    children: React.ReactNode;
}) {
    return (
        <PermixProvider permix={permix}>
            <PermixHydrate state={state}>
                <ClientRulesSetup
                    permix={permix}
                    state={state}
                    session={session}
                >
                    {children}
                    <TanStackDevtools
                        plugins={[
                            {
                                name: "TanStack Query",
                                render: <ReactQueryDevtoolsPanel />,
                            },
                            {
                                name: "TanStack Router",
                                render: <TanStackRouterDevtoolsPanel />,
                            },
                        ]}
                    />
                </ClientRulesSetup>
            </PermixHydrate>
        </PermixProvider>
    );
}
