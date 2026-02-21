import React, { useState } from 'react';
import { MapPin, User, Plus } from 'lucide-react';
import DateTimePicker from './DateTimePicker';
import PassengerPicker from './PassengerPicker';

const BookingForm = ({ onSearch, initialData }) => {
    const [searchData, setSearchData] = useState(initialData || {
        pickup_location: '',
        dropoff_location: '',
        pickup_date: new Date().toISOString().split('T')[0],
        pickup_time: '12:00',
        return_date: '',
        return_time: '12:00',
        is_return: false,
        passengers: 2
    });

    // Active Dropdown State: 'pickup-date', 'return-date', 'passengers', or null
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (name) => {
        setActiveDropdown(prev => prev === name ? null : name);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchData({ ...searchData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchData);
    };

    return (
        <div className="booking-form-wrapper">
            {/* 1. TABS ROW - Now styled absolutely for desktop */}
            <div className="booking-tabs">
                <div
                    className={`booking-tab ${!searchData.is_return ? 'active' : ''}`}
                    onClick={() => setSearchData({ ...searchData, is_return: false })}
                >
                    <div className="tab-radio"></div>
                    <span>One-way</span>
                </div>
                <div
                    className={`booking-tab ${searchData.is_return ? 'active' : ''}`}
                    onClick={() => setSearchData({ ...searchData, is_return: true })}
                >
                    <div className="tab-radio"></div>
                    <span>Return</span>
                </div>
            </div>

            {/* GROUP 1: LOCATIONS */}
            <div className="bf-locations-container">
                <div className="location-timeline-line"></div>
                <div className="location-timeline-dots">
                    <div className="timeline-dot pickup"></div>
                    <div className="timeline-dot dropoff"></div>
                </div>

                {/* Pickup */}
                <div className="field-row location-row">
                    <input
                        type="text"
                        name="pickup_location"
                        placeholder="Enter pick-up location"
                        value={searchData.pickup_location}
                        onChange={handleInputChange}
                        className="b-input"
                        required
                    />
                </div>

                {/* Switch Icon */}
                <div className="location-swap-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4" /></svg>
                </div>

                {/* Dropoff */}
                <div className="field-row location-row">
                    <input
                        type="text"
                        name="dropoff_location"
                        placeholder="Enter destination"
                        value={searchData.dropoff_location}
                        onChange={handleInputChange}
                        className="b-input"
                        required
                    />
                </div>
            </div>

            {/* GROUP 2: DATES */}
            <div className="bf-dates-container">
                {/* Depart */}
                <div className="split-half">
                    <DateTimePicker
                        dateValue={searchData.pickup_date}
                        timeValue={searchData.pickup_time}
                        onDateChange={(d) => setSearchData({ ...searchData, pickup_date: d })}
                        onTimeChange={(t) => setSearchData({ ...searchData, pickup_time: t })}
                        isOpen={activeDropdown === 'pickup-date'}
                        onToggle={() => toggleDropdown('pickup-date')}
                    />
                </div>
                {/* Return */}
                <div
                    className={`split-half ${!searchData.is_return ? 'placeholder-mode' : ''}`}
                    onClick={() => !searchData.is_return && setSearchData({ ...searchData, is_return: true })}
                >
                    {searchData.is_return ? (
                        <DateTimePicker
                            dateValue={searchData.return_date}
                            timeValue={searchData.return_time}
                            onDateChange={(d) => setSearchData({ ...searchData, return_date: d })}
                            onTimeChange={(t) => setSearchData({ ...searchData, return_time: t })}
                            isOpen={activeDropdown === 'return-date'}
                            onToggle={() => toggleDropdown('return-date')}
                        />
                    ) : (
                        <div className="add-return-text">
                            <Plus size={16} />
                            <span>Add a return</span>
                        </div>
                    )}
                </div>
            </div>

            {/* GROUP 3: PASSENGERS */}
            <div className="bf-passengers-container">
                <div className="field-row">
                    <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
                        <PassengerPicker
                            initialValue={searchData.passengers}
                            onChange={(val) => setSearchData({ ...searchData, passengers: val })}
                            isOpen={activeDropdown === 'passengers'}
                            onToggle={() => toggleDropdown('passengers')}
                        />
                    </div>
                </div>
            </div>

            {/* GROUP 4: BUTTON */}
            <button onClick={handleSubmit} className="action-search-btn">
                Search
            </button>
        </div>
    );
};

export default BookingForm;
