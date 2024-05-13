import { error } from "@sveltejs/kit";
import type { Response } from "./types";

export function handleErrors<T>(res: Response<T>): {
	data: T;
} {
	if (res.error) {
		error(res.error.code, {
			message: res.error.message
		});
	}

	if (!res.data) {
		error(500, {
			message: "something unexpected went wrong"
		});
	}

	return {
		data: res.data
	};
}
