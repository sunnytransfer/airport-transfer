import React, { useState, useEffect } from 'react';
import { User, Briefcase, Check, Edit2, ArrowLeft, MessageCircle, Phone, Mail, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// --- SUB-COMPONENTS ---

/* 1. TOP SEARCH SUMMARY */
const SearchSummary = ({ searchData, onEdit }) => {
    // Safety checks for data
    const pickup = searchData?.pickup_location || 'Unknown Location';
    const dropoff = searchData?.dropoff_location || 'Unknown Location';
    const dateVal = searchData?.pickup_date ? new Date(searchData.pickup_date) : new Date();
    const dateStr = dateVal.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const timeStr = searchData?.pickup_time || '00:00';
    const pax = searchData?.passengers || 1;
    const type = searchData?.is_return ? 'Return' : 'One-way';

    const route = `${pickup} → ${dropoff}`;
    const info = `${pax} Passengers • ${type} • ${dateStr}, ${timeStr}`;

    return (
        <div className="search-summary-card">
            <div className="summary-content">
                <div className="summary-route">{route}</div>
                <div className="summary-details">{info}</div>
            </div>
            <button className="summary-edit-btn" onClick={onEdit}>
                <Edit2 size={16} /> Edit Search
            </button>
        </div>
    );
};

/* 2. LOADING SKELETON */
const LoadingSkeleton = () => (
    <div className="vehicle-list-skeleton">
        {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
                <div className="sk-img"></div>
                <div className="sk-content">
                    <div className="sk-title"></div>
                    <div className="sk-text"></div>
                    <div className="sk-text small"></div>
                </div>
                <div className="sk-price"></div>
            </div>
        ))}
    </div>
);

/* 3. RESCUE STATE (Empty) */
const EmptyState = ({ searchData, onEdit }) => (
    <div className="empty-state-container">
        <div className="empty-icon-wrapper">
            <AlertCircle size={48} color="#d9534f" />
        </div>
        <h3>No exact result found</h3>
        <p>
            We couldn't find a vehicle for <strong>{searchData?.passengers || '?'} passengers</strong> on this date.
            <br />
            But don't worry, we can arrange a custom transfer for you immediately!
        </p>

        <div className="empty-actions">
            <div className="fix-buttons">
                <button onClick={onEdit} className="fix-btn">Edit Passengers</button>
                <button onClick={onEdit} className="fix-btn">Change Date</button>
            </div>
        </div>

        <div className="contact-options">
            <h4>Contact us for a quick quote:</h4>
            <div className="contact-grid">
                <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="contact-btn whatsapp">
                    <MessageCircle size={20} /> WhatsApp
                </a>
                <a href="tel:+905555555555" className="contact-btn phone">
                    <Phone size={20} /> Call Now
                </a>
                <a href="mailto:info@marmaristransfer.com" className="contact-btn email">
                    <Mail size={20} /> Email
                </a>
            </div>
        </div>

        <button onClick={onEdit} className="back-to-search-link">
            <ArrowLeft size={16} /> Back to Search
        </button>
    </div>
);

/* 4. VEHICLE CARD */
const VehicleCard = ({ vehicle, isSelected, onSelect, convertPrice, isReturn }) => {
    // Parse price safely
    const priceDisplay = isReturn ? convertPrice(vehicle.rawReturn) : convertPrice(vehicle.price);
    const oldPriceDisplay = isReturn ? convertPrice(vehicle.rawOneWay * 2) : null;

    return (
        <div
            className={`vehicle-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(vehicle)}
        >
            <div className="vc-image-col">
                <img
                    src={vehicle.img || '/images/default-car.jpg'}
                    alt={vehicle.name}
                    className="vc-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80' }}
                />
            </div>

            <div className="vc-info-col">
                <div className="vc-header">
                    <h4 className="vc-name">{vehicle.name}</h4>
                    <span className="vc-similar">or similar</span>
                </div>

                <div className="vc-badges">
                    <span className="vc-badge" title="Max Passengers"><User size={14} /> {vehicle.maxPassengers}</span>
                    <span className="vc-badge" title="Max Luggage"><Briefcase size={14} /> {vehicle.maxBags}</span>
                </div>

                <div className="vc-features">
                    {vehicle.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="vc-feature">
                            <Check size={14} color="#008a09" /> <span>{feat}</span>
                        </div>
                    ))}
                    <div className="vc-feature highlight">
                        <Check size={14} color="#008a09" /> <span>Free cancellation</span>
                    </div>
                </div>
            </div>

            <div className="vc-price-col">
                <div className="vc-price-group">
                    {oldPriceDisplay && (
                        <span className="vc-old-price">{oldPriceDisplay}</span>
                    )}
                    <div className="vc-total-price">
                        {priceDisplay}
                    </div>
                    <div className="vc-price-label">Total price</div>
                </div>
                <button className={`vc-select-btn ${isSelected ? 'selected' : ''}`}>
                    {isSelected ? 'Selected' : 'Select'}
                </button>
            </div>
        </div>
    );
};

/* 5. MAIN COMPONENT */
const VehicleList = ({ searchData, pricingRules = [], setSearchData, onBack, loading, error }) => {
    const navigate = useNavigate();
    const { convertPrice } = useCurrency();
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Process Rules Safe
    const processVehicles = () => {
        if (!pricingRules || !Array.isArray(pricingRules)) return [];

        const pax = parseInt(searchData?.passengers || 1, 10);

        return pricingRules.filter(rule => {
            // Ensure we handle defaults safely
            const min = parseInt(rule.min_pax || 0, 10);
            const max = parseInt(rule.max_pax || 100, 10);
            // Simple range check
            return pax >= min && pax <= max;
        }).map(rule => {
            const oneWay = parseFloat(rule.one_way_price || 0);
            const returnP = parseFloat(rule.return_price || 0);

            return {
                id: rule.id,
                name: rule.vehicle_name || 'Standard Vehicle',
                img: rule.vehicle_image,
                maxPassengers: parseInt(rule.max_pax || 4, 10),
                maxBags: parseInt(rule.max_bags || rule.max_pax || 4, 10), // Fallback to pax if bags missing
                price: searchData?.is_return ? returnP : oneWay,
                rawOneWay: oneWay,
                rawReturn: returnP,
                features: rule.vehicle_features ? rule.vehicle_features.split(',') : ['Meet & Greet', 'Door to Door', 'Flight Tracking']
            };
        });
    };

    const validVehicles = processVehicles();
    const isReady = !!selectedVehicle;

    const handleContinue = () => {
        if (!isReady) return;

        // Save to Session
        try {
            sessionStorage.setItem('booking_searchData', JSON.stringify(searchData));
            sessionStorage.setItem('booking_selectedVehicle', JSON.stringify(selectedVehicle));
            navigate('/checkout', { state: { searchData, selectedVehicle } });
        } catch (err) {
            console.error('Error saving booking data', err);
            alert('Something went wrong. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="vehicle-list-section">
                <div className="container">
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vehicle-list-section">
                <div className="container">
                    <div className="error-state-container" style={{ textAlign: 'center', padding: '50px 0', color: '#777' }}>
                        <AlertCircle size={48} color="#d9534f" style={{ margin: '0 auto 16px', display: 'block' }} />
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>Unable to load vehicles</h3>
                        <p style={{ marginBottom: '24px' }}>{error}</p>
                        <button onClick={onBack} className="back-to-search-link">
                            <ArrowLeft size={16} /> Back to Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!loading && validVehicles.length === 0) {
        return (
            <div className="vehicle-list-section">
                <div className="container">
                    <EmptyState searchData={searchData} onEdit={onBack} />
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-list-section">
            <div className="container">

                {/* 1. Top Summary */}
                <SearchSummary searchData={searchData} onEdit={onBack} />

                {/* 2. Content Grid */}
                <div className="vl-grid-layout">

                    {/* Left: List */}
                    <div className="vl-list-col">
                        <h2 className="vl-heading">Select your vehicle</h2>
                        <div className="vl-list">
                            {validVehicles.map(v => (
                                <VehicleCard
                                    key={v.id}
                                    vehicle={v}
                                    isSelected={selectedVehicle?.id === v.id}
                                    onSelect={setSelectedVehicle}
                                    convertPrice={convertPrice}
                                    isReturn={searchData?.is_return}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Sticky Summary */}
                    <div className="vl-sidebar-col">
                        <div className="booking-summary-card">
                            <h3>Your selection</h3>

                            <div className="bs-timeline">
                                <div className="bs-point">
                                    <div className="bs-dot pickup"></div>
                                    <div className="bs-loc">{searchData.pickup_location}</div>
                                </div>
                                <div className="bs-line"></div>
                                <div className="bs-point">
                                    <div className="bs-dot dropoff"></div>
                                    <div className="bs-loc">{searchData.dropoff_location}</div>
                                </div>
                            </div>

                            <div className="bs-info-rows">
                                <div className="bs-row">
                                    <span className="bs-label">Date</span>
                                    <span className="bs-val">{new Date(searchData.pickup_date).toLocaleDateString()} {searchData.pickup_time}</span>
                                </div>
                                <div className="bs-row">
                                    <span className="bs-label">Passengers</span>
                                    <span className="bs-val">{searchData.passengers}</span>
                                </div>
                                {selectedVehicle && (
                                    <div className="bs-vehicle-selected">
                                        <Check size={16} /> {selectedVehicle.name}
                                    </div>
                                )}
                            </div>

                            <div className="bs-total-row">
                                <span>Total</span>
                                <span className="bs-total-price">
                                    {selectedVehicle ? (
                                        searchData.is_return ? convertPrice(selectedVehicle.rawReturn) : convertPrice(selectedVehicle.price)
                                    ) : '---'}
                                </span>
                            </div>

                            <button
                                className="bs-continue-btn"
                                onClick={handleContinue}
                                disabled={!isReady}
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. Mobile Sticky Bottom Bar */}
            <div className={`mobile-sticky-footer ${selectedVehicle ? 'visible' : ''}`}>
                <div className="msf-content">
                    <div className="msf-info">
                        <span className="msf-label">Total Price</span>
                        <span className="msf-price">
                            {selectedVehicle ? (
                                searchData.is_return ? convertPrice(selectedVehicle.rawReturn) : convertPrice(selectedVehicle.price)
                            ) : ''}
                        </span>
                    </div>
                    <button
                        className="msf-btn"
                        onClick={handleContinue}
                        disabled={!isReady}
                    >
                        Continue
                    </button>
                </div>
            </div>

        </div>
    );
};

export default VehicleList;
