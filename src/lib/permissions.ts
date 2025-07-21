import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    music: ["create", "create.instant_verified", "verify", "delete"]
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    music: ["create"],
    ...userAc.statements
});

export const admin = ac.newRole({
    music: ["create", "create.instant_verified", "delete", "verify"],
    ...adminAc.statements
})