export function customTrim(str: string, char: string) {
    if (!char) {
        return str.trim(); // Fallback to default trim if no custom character provided
    }

    const escapeChar = char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
    const regex = new RegExp(`^[${escapeChar}]+|[${escapeChar}]+$`, "g");

    return str.replace(regex, "");
}

export function shift(arr: any[]) {
    return arr.map((_, i, a) => a[(i + a.length - 1) % a.length]);
}
