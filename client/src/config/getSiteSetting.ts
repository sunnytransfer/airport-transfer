import { runtimeSiteSettings as siteSettings } from "./siteSettings.env";

type SiteSettings = typeof siteSettings;

export function getSiteSetting<K1 extends keyof SiteSettings>(k1: K1): SiteSettings[K1];
export function getSiteSetting<
    K1 extends keyof SiteSettings,
    K2 extends keyof SiteSettings[K1]
>(k1: K1, k2: K2): SiteSettings[K1][K2];

export function getSiteSetting(k1: any, k2?: any) {
    const v1 = (siteSettings as any)[k1];
    return k2 == null ? v1 : v1?.[k2];
}

export function selectSiteSetting<T>(selector: (s: typeof siteSettings) => T): T {
    return selector(siteSettings);
}
