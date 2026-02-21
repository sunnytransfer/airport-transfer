import React, { createContext, useState, useEffect, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    // Default to GBP as base, but allow user selection from localStorage
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GBP');
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);

    const currencySymbols = {
        'GBP': '£',
        'EUR': '€',
        'USD': '$',
        'TRY': '₺'
    };

    useEffect(() => {
        // Persist currency selection
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Fetch from our own backend which caches/manages the external API
                const res = await fetch('http://localhost:5000/api/rates');
                if (!res.ok) throw new Error('API unreachable');

                const data = await res.json();

                // Store in memory (and localStorage for offline fallback)
                setRates(data.rates);
                localStorage.setItem('rates_cache', JSON.stringify(data.rates));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch rates, using fallback", err);

                // Fallback to localStorage cache
                const cached = localStorage.getItem('rates_cache');
                if (cached) {
                    setRates(JSON.parse(cached));
                } else {
                    // Ultimate fallback if no cache ever existed
                    setRates({ EUR: 1.15, USD: 1.25, TRY: 40.0 });
                }
                setLoading(false);
            }
        };

        fetchRates();

        // Refresh periodically (e.g., every 30 mins)
        const interval = setInterval(fetchRates, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const convertPrice = (amountInGBP, targetCurrency = currency) => {
        // Base is always GBP now
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // console.log(`Converting ${amountInGBP} GBP to ${targetCurrency}`);
        }

        if (targetCurrency === 'GBP') {
            // Taxi style: whole numbers usually, but let's keep it clean
            return `£${Math.round(amountInGBP)}`;
        }

        if (!rates || !rates[targetCurrency]) return `£${amountInGBP}`;

        const rate = rates[targetCurrency];
        const converted = amountInGBP * rate;

        // Rounding Rules
        let finalAmount;
        if (targetCurrency === 'TRY') {
            finalAmount = Math.round(converted); // No decimals for Lira
        } else {
            finalAmount = Math.round(converted); // Taxi style: usually 0 decimals for EUR/USD too
        }

        const symbol = currencySymbols[targetCurrency] || targetCurrency;
        return `${symbol}${finalAmount}`;
    };

    // Helper to get raw value for calculations
    const getConvertedAmount = (amountInGBP, targetCurrency = currency) => {
        if (targetCurrency === 'GBP') return amountInGBP;
        if (!rates || !rates[targetCurrency]) return amountInGBP;
        return amountInGBP * rates[targetCurrency];
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, getConvertedAmount, rates, loading, currencySymbols }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
