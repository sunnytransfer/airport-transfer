export function silenceConsoleInProduction() {
    if (import.meta.env.PROD) {
        console.log = () => { };
        console.info = () => { };
        console.warn = () => { };
    }
}
