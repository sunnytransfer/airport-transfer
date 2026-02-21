import React, { createContext, useState, useEffect, useContext } from 'react';

const SiteContext = createContext();

const CACHE_KEY = 'site_settings_cache';

export const SiteProvider = ({ children }) => {
    // Default settings (Foundation)
    const defaults = {
        brandName: 'MarmarisTrip',
        siteTitle: 'MarmarisTrip', // Legacy mapping
        logoUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        enableTransfers: true,
        enableExcursions: false,
        enableBlog: false,
        enableWhatsApp: true,
        contactPhone: '+90 555 555 55 55',
        contactEmail: 'info@marmaristrip.com',
        header: { // Legacy structure for Navbar compatibility
            navItems: [
                { label: 'Private Airport Transfers', path: '/', icon: 'CarTaxiFront' },
                { label: 'Excursions', path: '/excursions', icon: 'Map' }
            ]
        }
    };

    // Initialize state from LocalStorage if available (Stale-while-revalidate)
    const [settings, setSettings] = useState(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                return { ...defaults, ...JSON.parse(cached) };
            }
        } catch (e) {
            console.error("Error reading settings from LS", e);
        }
        return defaults;
    });

    const [loading, setLoading] = useState(true);

    // Fetch latest settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`/api/site-settings?t=${Date.now()}`); // Prevent browser caching
                if (!res.ok) throw new Error('Failed to fetch settings');

                const data = await res.json();

                // Merge and Map for Compatibility
                const newSettings = {
                    ...defaults,
                    ...data,
                    siteTitle: data.brandName || defaults.siteTitle, // Map brandName to siteTitle
                    header: {
                        ...defaults.header,
                        logoUrl: data.logoUrl || defaults.header.logoUrl
                    }
                };

                // Update State
                setSettings(newSettings);

                // Update Cache
                localStorage.setItem(CACHE_KEY, JSON.stringify(newSettings));
            } catch (err) {
                console.error("Settings Sync Failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Helper to check feature toggles
    const isFeatureEnabled = (featureName) => {
        return !!settings[`enable${featureName}`]; // e.g., enableBlog
    };

    return (
        <SiteContext.Provider value={{ settings, loading, isFeatureEnabled }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);
