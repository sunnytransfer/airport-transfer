export const siteSettings = Object.freeze({
    app: {
        name: "localhost5173",
        description: "",
        url: "http://localhost:5173",
        environment: "development",
        version: "1.0.0"
    },

    seo: {
        defaultTitle: "localhost5173",
        titleTemplate: "%s | ",
        defaultDescription: "Performance-first app",
        ogImage: "/og.jpg",
        twitterHandle: ""
    },

    performance: {
        lazyImages: true,
        prefetchRoutes: true,
        preloadFonts: true,
        cacheAssets: true,
        seoDebug: false
    },

    localization: {
        defaultLanguage: "tr",
        supportedLanguages: ["tr", "en"]
    },

    contact: {
        email: "",
        phone: "",
        whatsapp: ""
    },

    integrations: {
        gtm: "",
        analytics: "",
        metaPixel: ""
    }
});
