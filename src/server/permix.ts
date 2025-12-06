import { getRules, PermissionsDefinition, permix } from "~/lib/permix";
import { or } from "./orpc";
import { createPermix } from "permix/orpc";

export const orpcPermix = createPermix<PermissionsDefinition>();

export const protectedMiddleware = or.use(({ context, next }) => {
  if (!context.session) {
    console.log("[WARN] no session");
  }
  const rules = getRules(context.session);
  const p = orpcPermix.setup(rules);
  permix.setup(rules); // just in case

  return next({
    context: {
      permix: p,
    },
  });
});
