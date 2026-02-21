import { Seo } from "@/seo/Seo";

export default function SeoTest() {
    return (
        <>
            <Seo
                title="SEO Test"
                description="Meta tags smoke test"
                canonicalPath="/seo-test"
                ogImage="/og.jpg"
            />
            <main style={{ padding: 16 }}>
                <h1>SEO Test</h1>
                <p>Check document head for title, meta description, canonical, OG and Twitter tags.</p>
            </main>
        </>
    );
}
