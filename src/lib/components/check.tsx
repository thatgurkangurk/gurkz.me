import { useEffect, useState } from "react";
import type { CheckArgs, RulesPaths } from "permix";
import type { CheckProps } from "permix/react";

import type { PermissionsDefinition } from "#lib/permix.js";
import { usePermix } from "#lib/util/use-permix.js";

export function Check<P extends RulesPaths<PermissionsDefinition>>({
    children,
    path,
    data,
    otherwise = null,
    reverse = false,
}: CheckProps<PermissionsDefinition, P>) {
    const { check } = usePermix();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const hasPermission = check(
        ...([path, data] as unknown as CheckArgs<PermissionsDefinition>),
    );

    const shouldRenderChildren = reverse ? !hasPermission : hasPermission;

    if (!isMounted) {
        return (
            <span style={{ display: "contents" }} suppressHydrationWarning>
                {shouldRenderChildren ? children : otherwise}
            </span>
        );
    }

    return shouldRenderChildren ? children : otherwise;
}
