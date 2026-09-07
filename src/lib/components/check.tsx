import { useSyncExternalStore } from "react";
import type { CheckArgs, RulesPaths } from "permix";
import type { CheckProps } from "permix/react";

import type { PermissionsDefinition } from "#lib/permix.js";
import { usePermix } from "#lib/util/use-permix.js";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Check<P extends RulesPaths<PermissionsDefinition>>({
    children,
    path,
    data,
    otherwise = null,
    reverse = false,
}: CheckProps<PermissionsDefinition, P>) {
    const { check } = usePermix();

    const isClient = useSyncExternalStore(
        emptySubscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    const isDynamic = data !== undefined && data !== null;

    if (isDynamic && !isClient) {
        const fallback = reverse ? children : otherwise;
        return <span style={{ display: "contents" }}>{fallback}</span>;
    }

    const hasPermission = check(
        ...([path, data] as unknown as CheckArgs<PermissionsDefinition>),
    );

    const shouldRender = reverse ? !hasPermission : hasPermission;
    const content = shouldRender ? children : otherwise;

    return <span style={{ display: "contents" }}>{content}</span>;
}
