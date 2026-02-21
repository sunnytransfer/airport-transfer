import React from 'react';

import Footer from '../components/Footer';

const Excursions = () => {
    return (
        <>
            {/* Navbar removed - provided by PublicLayout */}
            <div className="hero" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="container">
                    <h1>Find the perfect excursion</h1>
                    <p>Discover top-rated tours and activities in Marmaris</p>

                    {/* Placeholder for excursion search */}
                    <div className="search-bar-container" style={{ maxWidth: '800px', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ color: '#555' }}>Excursion search coming soon...</p>
                    </div>
                </div>
            </div>
            {/* Footer removed - provided by PublicLayout */}
        </>
    );
};

export default Excursions;
