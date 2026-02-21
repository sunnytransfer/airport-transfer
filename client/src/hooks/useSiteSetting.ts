import { runtimeSiteSettings } from "@/config/siteSettings.env";

export function useSiteSetting<T>(
    selector: (s: typeof runtimeSiteSettings) => T
): T {
    return selector(runtimeSiteSettings);
}
