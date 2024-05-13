export type ResponseError = {
	message: string;
	code: number;
};

export type Response<T> = {
	data?: T;
	error?: ResponseError;
};
