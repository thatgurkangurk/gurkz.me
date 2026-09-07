import { useState, useEffect } from "react";
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
    const { check, isReady } = usePermix();

    if (!isReady) {
        return null;
    }

    const hasPermission = check(
        ...([path, data] as unknown as CheckArgs<PermissionsDefinition>),
    );

    return reverse
        ? hasPermission
            ? otherwise
            : children
        : hasPermission
          ? children
          : otherwise;
}
