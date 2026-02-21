export function onIdle(cb: () => void) {
    if (typeof window === "undefined") return;
    const ric = (window as any).requestIdleCallback as undefined | ((fn: () => void) => void);
    if (ric) return ric(cb);
    setTimeout(cb, 250);
}
