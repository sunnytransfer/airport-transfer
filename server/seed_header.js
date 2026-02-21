const db = require('./db');

const headerSettings = {
    siteTitle: 'Marmaristrip',
    logoUrl: '',
    tagline: '',
    contact: { phone: '', email: '' },
    socials: { facebook: '', instagram: '', tiktok: '', youtube: '' },
    navItems: [
        { label: 'Airport Transfers', path: '/', icon: 'CarTaxiFront' },
        { label: 'Excursions', path: '/excursions', icon: 'Ticket' }
    ],
    cta: { label: 'Log in', path: '/admin', icon: 'User', color: '', enabled: true },
    sticky: true
};

const seed = () => {
    const json = JSON.stringify(headerSettings);
    console.log('Seeding header settings...');

    // We update both 'header' key in settings
    db.run(`INSERT INTO settings (key, value, draft_value) VALUES (?, ?, ?) 
        ON CONFLICT(key) DO UPDATE SET value = ?, draft_value = ?`,
        ['header', json, json, json, json],
        (err) => {
            if (err) {
                console.error('Error seeding header:', err.message);
            } else {
                console.log('Header settings seeded successfully.');
            }
        }
    );
};

seed();
