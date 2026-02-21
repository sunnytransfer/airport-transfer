export type PreloadFn = () => Promise<unknown>;

export const preloadRoutes: Record<string, PreloadFn> = {
    seoTest: () => import("@/pages/SeoTest"),
};
