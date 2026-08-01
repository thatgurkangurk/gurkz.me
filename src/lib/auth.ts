import type { User, Session } from "$lib/server/auth";

/**
 * @deprecated use `User` directly from `$lib/server/auth` instead.
 * @see {@link User}
 */
type DeprecatedUser = User;

/**
 * @deprecated use `Session` directly from `$lib/server/auth` instead.
 * @see {@link Session}
 */
type DeprecatedSession = Session;

export type { DeprecatedUser as User, DeprecatedSession as Session };
