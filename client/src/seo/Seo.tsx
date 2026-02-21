import { useMemo, useEffect } from "react";
import { useSiteSetting } from "@/hooks/useSiteSetting";
import { trackPageView } from "@/analytics/trackPage";

type SeoProps = {
    title?: string;
    description?: string;
    canonicalPath?: string;
    ogImage?: string;
    noindex?: boolean;
};

function upsertMeta(nameOrProp: "name" | "property", key: string, content: string) {
    const selector = `meta[${nameOrProp}="${key}"]`;
    const elements = document.head.querySelectorAll(selector);

    // Remove duplicates
    if (elements.length > 1) {
        for (let i = 1; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    let el = elements[0] as HTMLMetaElement | undefined;
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameOrProp, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
    const elements = document.head.querySelectorAll(`link[rel="${rel}"]`);

    // Remove duplicates
    if (rel === "canonical") {
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    } else if (elements.length > 1) {
        for (let i = 1; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    let el = rel === "canonical" ? undefined : elements[0] as HTMLLinkElement | undefined;

    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

export function Seo(props: SeoProps) {
    if (typeof document === "undefined") return null;

    const defaults = useSiteSetting(s => s.seo);
    const app = useSiteSetting(s => s.app);
    const lang = useSiteSetting(s => s.localization.defaultLanguage);
    const ogLocale = lang === "tr" ? "tr_TR" : "en_US";

    const perf = useSiteSetting(s => s.performance);

    const computed = useMemo(() => {
        const titleRaw = props.title?.trim() || defaults.defaultTitle;
        const title = props.title
            ? defaults.titleTemplate.replace("%s", titleRaw)
            : titleRaw;

        const description = (props.description?.trim() ||
            defaults.defaultDescription).slice(0, 300);

        const canonical = props.canonicalPath
            ? new URL(props.canonicalPath, app.url).toString()
            : new URL("/", app.url).toString();

        const ogImage = new URL(props.ogImage || defaults.ogImage, app.url).toString();

        return { title, description, canonical, ogImage };
    }, [
        props.title,
        props.description,
        props.canonicalPath,
        props.ogImage,
        defaults,
        app.url
    ]);

    useEffect(() => {
        if (perf.seoDebug && import.meta.env.DEV) {
            console.info("SEO_UPDATE:", computed);
        }

        document.title = computed.title;
        document.documentElement.lang = lang;

        if (perf.preloadFonts) {
            upsertLink("preconnect", "https://fonts.googleapis.com");
            upsertLink("preconnect", "https://fonts.gstatic.com");
        }

        upsertMeta("name", "description", computed.description);

        upsertLink("canonical", computed.canonical);

        upsertMeta("property", "og:title", computed.title);
        upsertMeta("property", "og:description", computed.description);
        upsertMeta("property", "og:url", computed.canonical);
        upsertMeta("property", "og:image", computed.ogImage);
        upsertMeta("property", "og:locale", ogLocale);

        upsertMeta("name", "twitter:card", "summary_large_image");
        if (defaults.twitterHandle) {
            upsertMeta("name", "twitter:site", defaults.twitterHandle);
        }
        upsertMeta("name", "twitter:title", computed.title);
        upsertMeta("name", "twitter:description", computed.description);
        upsertMeta("name", "twitter:image", computed.ogImage);

        if (props.noindex) {
            upsertMeta("name", "robots", "noindex,nofollow");
        } else {
            upsertMeta("name", "robots", "index,follow");
        }

        if (import.meta.env.PROD) {
            trackPageView(computed.canonical);
        }
    }, [computed, defaults.twitterHandle, props.noindex, ogLocale, perf.preloadFonts]);

    return null;
}
