import type { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DbSchema, DbType } from "~/db";

export function CustomDrizzleAdapter(db: DbType, schema: DbSchema): Adapter {
    const base = DrizzleAdapter(db, {
        usersTable: schema.users,
        sessionsTable: schema.sessions,
        accountsTable: schema.accounts,
        authenticatorsTable: schema.authenticators,
        verificationTokensTable: schema.verificationTokens,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (base as any).getSessionAndUser = async (sessionToken: string) => {
        const userAndSession = await db.query.sessions.findFirst({
            where: (table, { eq }) => eq(table.sessionToken, sessionToken),
            with: {
                user: {
                    columns: {
                        permissions: true,
                        role: true,
                        email: true,
                        emailVerified: true,
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        if (!userAndSession) return null;
        const { user, ...session } = userAndSession;
        return { user: { ...user }, session };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (base as any).getUser = async (id: string) => {
        const user = await db.query.users.findFirst({
            where: (table, { eq }) => eq(table.id, id),
        });

        return user;
    };

    return base as Adapter;
}
