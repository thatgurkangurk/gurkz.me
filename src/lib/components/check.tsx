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

    const isDynamic = data !== undefined && data !== null;

    useEffect(() => {
        if (isDynamic) {
            setIsMounted(true);
        }
    }, [isDynamic]);

    if (isDynamic && !isMounted) {
        const fallback = reverse ? children : otherwise;
        return <>{fallback}</>;
    }

    const hasPermission = check(
        ...([path, data] as unknown as CheckArgs<PermissionsDefinition>),
    );

    const shouldRender = reverse ? !hasPermission : hasPermission;

    return <>{shouldRender ? children : otherwise}</>;
}
