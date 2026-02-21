import { runtimeSiteSettings } from "@/config/siteSettings.env";

export function validateSiteSettings() {
    if (import.meta.env.DEV) {
        if (!runtimeSiteSettings.app.name) throw new Error("siteSettings.app.name is required");
        if (!runtimeSiteSettings.seo.defaultTitle) throw new Error("siteSettings.seo.defaultTitle is required");
        if (!runtimeSiteSettings.seo.defaultDescription) throw new Error("siteSettings.seo.defaultDescription is required");
    }
}
