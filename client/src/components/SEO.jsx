import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonicalUrl }) => {
    const siteTitle = 'Marmaristrip';
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Airport Taxi & Attractions`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Book trusted airport transfers and top-rated excursions in Marmaris. Reliable, affordable, and VIP transport services."} />
            <meta name="keywords" content={keywords || "Marmaris taxi, Dalaman transfer, Marmaris excursions, airport shuttle, VIP transfer, Turkey travel"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || "Book trusted airport transfers and top-rated excursions in Marmaris."} />
            <meta property="og:url" content={canonicalUrl || window.location.href} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || "Book trusted airport transfers and top-rated excursions in Marmaris."} />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl || window.location.href} />
        </Helmet>
    );
};

export default SEO;
