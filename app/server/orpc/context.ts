import { User } from "../auth/subjects";

export type Context = {
	user: User | null | undefined;
};
