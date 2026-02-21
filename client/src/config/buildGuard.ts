import { runtimeSiteSettings } from "@/config/siteSettings.env";

if (!runtimeSiteSettings.app.name) {
    throw new Error("Build blocked: app.name missing");
}

if (!runtimeSiteSettings.seo.defaultTitle) {
    throw new Error("Build blocked: seo.defaultTitle missing");
}

if (!runtimeSiteSettings.seo.defaultDescription) {
    throw new Error("Build blocked: seo.defaultDescription missing");
}
