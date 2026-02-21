export function isAvailable(date: string) {
    const selected = new Date(date);
    const now = new Date();
    const diff = selected.getTime() - now.getTime();
    return diff > 24 * 60 * 60 * 1000;
}
