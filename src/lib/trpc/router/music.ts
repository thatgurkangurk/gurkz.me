import { procedure, router } from "../utils";

export default router({
	hello: procedure.query(() => {
		return "hello world";
	}),
});
