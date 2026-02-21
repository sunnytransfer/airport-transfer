export function attachGlobalErrorHandlers() {
    if (typeof window === "undefined") return;

    window.addEventListener("error", (e) => {
        console.error("RUNTIME_ERROR:", e.message);
    });

    window.addEventListener("unhandledrejection", (e) => {
        console.error("UNHANDLED_PROMISE:", e.reason);
    });
}
