import { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';
import VehicleList from '../components/VehicleList';
import { Seo } from "@/seo/Seo";
import { CheckCircle } from 'lucide-react';

import { PreloadOnHover } from "@/router/PreloadOnHover";
import { preloadRoutes } from "@/router/preloadRoutes";

const Home = () => {
    const [searchData, setSearchData] = useState({
        pickup_location: '',
        dropoff_location: '',
        pickup_date: new Date().toISOString().split('T')[0],
        pickup_time: '12:00',
        return_date: '',
        return_time: '12:00',
        is_return: false,
        passengers: 2
    });

    const [showVehicleList, setShowVehicleList] = useState(false);
    const [pricingRules, setPricingRules] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch('/api/pricing-rules')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch pricing rules');
                return res.json();
            })
            .then(data => {
                if (data.data) {
                    setPricingRules(data.data);
                } else {
                    setPricingRules([]);
                }
            })
            .catch(err => {
                console.error('Error fetching pricing rules:', err);
                setError('Failed to load vehicle data. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (data) => {
        setSearchData(data);
        if (!data.pickup_location || !data.dropoff_location) {
            alert('Please enter pickup and dropoff locations');
            return;
        }
        setShowVehicleList(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Seo title="Home" description="Main entry" canonicalPath="/" />

            <div style={{ textAlign: "center", padding: "12px", background: "#febb02" }}>
                <PreloadOnHover preload={preloadRoutes.seoTest}>
                    <a href="/seo-test" style={{ fontWeight: "bold", color: "#003580" }}>SEO Test Page</a>
                </PreloadOnHover>
            </div>

            {!showVehicleList && (
                <div className="hero" id="booking-section">
                    <div className="container">
                        <div className="hero-text-center">
                            <h1>
                                Your Journey, Your Experience
                            </h1>
                            <p>
                                Airport Taxi & Excursions in Marmaris
                            </p>
                        </div>

                        {/* Booking Form Component */}
                        <BookingForm onSearch={handleSearch} initialData={searchData} />

                        {/* Trust Badges */}
                        <div className="trust-badges-row" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <CheckCircle size={18} color="#008a09" fill="#e6f4ea" />
                                <span style={{ fontSize: '0.9rem', color: '#333' }}>Flight tracking - Your driver will track your flight.</span>
                            </div>
                            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <CheckCircle size={18} color="#008a09" fill="#e6f4ea" />
                                <span style={{ fontSize: '0.9rem', color: '#333' }}>Pay on arrival – No advance payment, no extra costs.</span>
                            </div>
                            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <CheckCircle size={18} color="#008a09" fill="#e6f4ea" />
                                <span style={{ fontSize: '0.9rem', color: '#333' }}>Tried and true service - Professional drivers and 24/7 care.</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {showVehicleList ? (
                <VehicleList
                    searchData={searchData}
                    pricingRules={pricingRules}
                    setSearchData={setSearchData}
                    onBack={() => setShowVehicleList(false)}
                    loading={loading}
                    error={error}
                />
            ) : (
                <div style={{ padding: '60px 0', background: '#f9f9f9', textAlign: 'center' }}>
                    <div className="container">
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Trusted by travelers worldwide</h2>
                        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>Join thousands of satisfied customers who trust us for their airport transfers in Marmaris.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                                    <div style={{ color: '#ffc107', fontSize: '1.2rem', marginBottom: '10px' }}>★★★★★</div>
                                    <p style={{ fontSize: '0.95rem', color: '#555', fontStyle: 'italic', marginBottom: '15px' }}>"Excellent service. The driver was waiting for us with a name sign. Car was clean and comfortable."</p>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>Valued Customer</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
