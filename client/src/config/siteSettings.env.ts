import { siteSettings } from "./siteSettings";

function deepFreeze<T>(obj: T): Readonly<T> {
    if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
        Object.freeze(obj);
        for (const key of Object.keys(obj as any)) {
            deepFreeze((obj as any)[key]);
        }
    }
    return obj as Readonly<T>;
}

export const runtimeSiteSettings = deepFreeze({
    ...siteSettings,

    app: {
        ...siteSettings.app,
        url: import.meta.env.VITE_APP_URL || siteSettings.app.url,
        environment: import.meta.env.MODE || siteSettings.app.environment,
    },

    integrations: {
        ...siteSettings.integrations,
        gtm: import.meta.env.VITE_GTM || "",
        analytics: import.meta.env.VITE_ANALYTICS || "",
        metaPixel: import.meta.env.VITE_META_PIXEL || "",
    }
});
