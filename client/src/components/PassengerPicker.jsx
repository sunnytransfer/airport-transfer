import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown } from 'lucide-react';

const PassengerPicker = ({ onChange, initialValue, isOpen, onToggle }) => {
    // const [isOpen, setIsOpen] = useState(false); // Removed local state
    const dropdownRef = useRef(null);
    const [selected, setSelected] = useState(initialValue || 2);

    useEffect(() => {
        if (onChange) onChange(selected);
    }, [selected]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isOpen) onToggle();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (num) => {
        setSelected(num);
        onToggle(); // Close on select
    };

    return (
        <div className="passenger-picker-root" ref={dropdownRef}>
            {/* Trigger */}
            <div
                className="passenger-trigger"
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
            >
                <span className="passenger-text">
                    {selected} {selected === 1 ? 'Passenger' : 'Passengers'}
                </span>
                <ChevronDown size={18} className={`passenger-chevron ${isOpen ? 'open' : ''}`} />
            </div>

            {/* Dropdown List */}
            {isOpen && (
                <div className="passenger-dropdown-menu">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                        <div
                            key={num}
                            onClick={() => handleSelect(num)}
                            className={`passenger-option ${num === selected ? 'selected' : ''}`}
                        >
                            <span>{num} {num === 1 ? 'Passenger' : 'Passengers'}</span>
                            {num === selected && <span className="check-icon">✓</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PassengerPicker;
