import { procedure, router } from "../utils";

export default router({
	hello: procedure.query(({ ctx }) => {
		return `hi, ${ctx.user?.username}`;
	}),
});
