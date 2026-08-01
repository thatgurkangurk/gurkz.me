export function getInitials(name?: string | null): string {
	if (!name) return "??";

	const words = name.trim().split(/\s+/);

	if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase();
	}

	return name[0].toUpperCase();
}
