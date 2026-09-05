export function toErrors(arr: string[]): [string, ...string[]] | null {
	if (arr.length === 0) return null;

	const [first, ...rest] = arr;
	return [first, ...rest];
}
