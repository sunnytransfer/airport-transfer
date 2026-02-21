import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Plane, Info, Check, Minus, Plus, ChevronLeft, CreditCard } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useCurrency } from '../context/CurrencyContext';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Data
    const searchData = location.state?.searchData || JSON.parse(sessionStorage.getItem('booking_searchData')) || {};
    const selectedVehicle = location.state?.selectedVehicle || JSON.parse(sessionStorage.getItem('booking_selectedVehicle')) || {
        name: 'Standard Sedan',
        price: 50,
        img: '',
        maxPassengers: 4,
        maxBags: 3
    };

    const { convertPrice } = useCurrency();

    // Form Data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        flight_number: '',
        hotel_name: '',
        note: '',
        baby_seats: 0
    });

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [touched, setTouched] = useState({});

    // Load from Session Storage
    useEffect(() => {
        const savedData = sessionStorage.getItem('checkoutFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
        setIsLoaded(true);
    }, []);

    // Save to Session Storage
    useEffect(() => {
        if (isLoaded) {
            sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
        }
    }, [formData, isLoaded]);

    // Validation Logic
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => phone && phone.length >= 8;

    const errors = {
        first_name: !formData.first_name,
        last_name: !formData.last_name,
        email: !isValidEmail(formData.email),
        phone: !isValidPhone(formData.phone),
        hotel_name: !formData.hotel_name
    };

    const isFormValid = !Object.values(errors).some(Boolean);

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleFinalSubmit = async () => {
        if (!isFormValid) return;

        const bookingDetails = {
            pickup_location: searchData.pickup_location || 'Antalya Airport',
            dropoff_location: searchData.dropoff_location || 'Alanya',
            pickup_date: searchData.pickup_date || new Date().toISOString().split('T')[0],
            pickup_time: searchData.pickup_time || '12:00',
            price: selectedVehicle.price || 0
        };

        const payload = {
            // Backward compatibility
            customer_name: `${formData.first_name} ${formData.last_name}`,
            email: formData.email,
            phone: formData.phone,
            pickup_location: bookingDetails.pickup_location,
            dropoff_location: bookingDetails.dropoff_location,
            pickup_time: `${bookingDetails.pickup_date}T${bookingDetails.pickup_time}`,
            flight_time: `${bookingDetails.pickup_date}T${bookingDetails.pickup_time}`, // Legacy
            is_return: searchData.is_return || false,
            hotel_name: formData.hotel_name,
            flight_number: formData.flight_number,
            note: formData.note,
            baby_seats: formData.baby_seats,
            price: bookingDetails.price,
            vehicle: selectedVehicle.name,

            // New Requested Fields
            firstName: formData.first_name,
            lastName: formData.last_name,
            hotelName: formData.hotel_name,
            flightNo: formData.flight_number,
            childSeats: formData.baby_seats,
            notes: formData.note,
            paymentMethod: paymentMethod
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                sessionStorage.removeItem('checkoutFormData');
                alert('Booking Confirmed! Confirmation email sent.');
                navigate('/');
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Network error. Please try again.');
        }
    };

    // Helper: Timeline Date
    const formatTimelineDate = (dateStr, timeStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} • ${timeStr || '12:00'}`;
    };

    return (
        <div style={{ background: '#f5f5f5', color: '#1a1a1a', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container" style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT COLUMN: Form */}
                <div className="checkout-main">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer', color: '#006ce4' }} onClick={handleBack}>
                        <ChevronLeft size={20} />
                        <span style={{ fontWeight: 600 }}>Back to selection</span>
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Secure Checkout</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Complete your booking details below.</p>

                    {/* SECTION 1: Passenger Details */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#003580" /> Passenger Details
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>First Name *</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('first_name')}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: touched.first_name && errors.first_name ? '1px solid #d93025' : '1px solid #ccc' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Last Name *</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('last_name')}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: touched.last_name && errors.last_name ? '1px solid #d93025' : '1px solid #ccc' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: touched.email && errors.email ? '1px solid #d93025' : '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Phone Number *</label>
                            <div style={{ border: touched.phone && errors.phone ? '1px solid #d93025' : '1px solid #ccc', borderRadius: '4px' }}>
                                <PhoneInput
                                    country={'tr'}
                                    value={formData.phone}
                                    onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                    onBlur={() => handleBlur('phone')}
                                    inputStyle={{ width: '100%', height: '42px', border: 'none', background: 'transparent' }}
                                    buttonStyle={{ border: 'none', background: 'transparent' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Trip Details */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={20} color="#003580" /> Trip Details
                        </h2>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Hotel Name / Pickup Address *</label>
                            <input
                                type="text"
                                name="hotel_name"
                                value={formData.hotel_name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('hotel_name')}
                                placeholder="e.g. Grand Yazici Club Turban"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: touched.hotel_name && errors.hotel_name ? '1px solid #d93025' : '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Flight Number <span style={{ fontWeight: 'normal', color: '#666' }}>(Optional)</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', background: 'white' }}>
                                <Plane size={18} color="#666" style={{ marginRight: '8px' }} />
                                <input
                                    type="text"
                                    name="flight_number"
                                    value={formData.flight_number}
                                    onChange={handleChange}
                                    placeholder="e.g. TK2543"
                                    style={{ width: '100%', border: 'none', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Extras */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={20} color="#003580" /> Extras
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Child Seats</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, baby_seats: Math.max(0, p.baby_seats - 1) }))}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ fontWeight: 'bold' }}>{formData.baby_seats}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, baby_seats: p.baby_seats + 1 }))}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #006ce4', background: 'white', color: '#006ce4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Notes (Optional)</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Special requests..."
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                            ></textarea>
                        </div>
                    </div>

                    {/* SECTION 4: Payment Methods */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={20} color="#003580" /> Payment
                        </h2>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '2px solid #006ce4', borderRadius: '8px', cursor: 'pointer', background: '#f5f9ff' }}>
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'cash'}
                                readOnly
                            />
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Pay on Arrival (Cash)</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Pay the driver in cash, USD, EUR, or GBP.</div>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleFinalSubmit}
                        disabled={!isFormValid}
                        style={{
                            width: '100%',
                            background: isFormValid ? '#006ce4' : '#ccc',
                            color: 'white',
                            padding: '16px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            transition: 'background 0.3s'
                        }}
                    >
                        {isFormValid ? 'Confirm Booking' : 'Fill all required fields'}
                    </button>

                </div>

                {/* RIGHT COLUMN: Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e7e7e7', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Your Journey</h3>

                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>
                            {selectedVehicle.name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>
                            {searchData.passengers} Passengers
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#003580', marginBottom: '16px' }}>
                            {convertPrice(selectedVehicle.price)}
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '24px' }}>
                            <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '24px', width: '2px', background: '#ccc' }}></div>
                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #333', background: 'white' }}></div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '2px' }}>{formatTimelineDate(searchData.pickup_date, searchData.pickup_time)}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{searchData.pickup_location}</div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #333', background: 'white' }}></div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '2px' }}>Drop-off</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{searchData.dropoff_location}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '12px', background: '#e8f4fd', borderRadius: '4px', color: '#004085', fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                        <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>Free cancellation up to 24 hours before pickup.</span>
                    </div>
                </div>

            </div>
            <style>{`
                @media (max-width: 900px) {
                    .container { grid-template-columns: 1fr !important; }
                    .checkout-main { order: 2; }
                }
             `}</style>
        </div>
    );
};

export default Checkout;
