import { runtimeSiteSettings } from "@/config/siteSettings.env";

export type SiteSettings = Readonly<typeof runtimeSiteSettings>;
