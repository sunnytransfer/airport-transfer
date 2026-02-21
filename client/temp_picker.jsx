import React, { useRef, useState, useEffect } from 'react';

const PassengerWheelPicker = ({ value, onChange, onClose, min = 1, max = 16 }) => {
    const itemHeight = 50; // Height of each option
    const containerHeight = 250; // Visible height
    const scrollRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Generate options
    const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    // Scroll Handler to detect centered item
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollTop = scrollRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        setSelectedIndex(index);
    };

    // Sync scroll to value on mount
    useEffect(() => {
        if (scrollRef.current) {
            const initialIndex = options.indexOf(value);
            if (initialIndex !== -1) {
                scrollRef.current.scrollTop = initialIndex * itemHeight;
                setSelectedIndex(initialIndex);
            }
        }
    }, []); // Run once on open

    // Snap and Select on scroll end (or click)
    const handleSelect = (index) => {
        setSelectedIndex(index);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: index * itemHeight,
                behavior: 'smooth'
            });
        }
        onChange(options[index]);
    };

    return (
        <div className="wheel-picker-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="wheel-picker-container" onClick={(e) => e.stopPropagation()} style={{
                width: '300px',
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                    Select Passengers
                </div>

                {/* Wheel Area */}
                <div style={{ position: 'relative', height: `${containerHeight}px` }}>

                    {/* Gradients */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
                        background: 'linear-gradient(to bottom, white, rgba(255,255,255,0))',
                        pointerEvents: 'none', zIndex: 10
                    }}></div>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                        background: 'linear-gradient(to top, white, rgba(255,255,255,0))',
                        pointerEvents: 'none', zIndex: 10
                    }}></div>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        style={{
                            height: '100%',
                            overflowY: 'auto',
                            scrollSnapType: 'y mandatory',
                            paddingTop: `${containerHeight / 2 - itemHeight / 2}px`, // Center first item
                            paddingBottom: `${containerHeight / 2 - itemHeight / 2}px`, // Center last item
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none' // IE
                        }}
                        className="no-scrollbar"
                    >
                        {options.map((opt, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={opt}
                                    onClick={() => handleSelect(index)}
                                    style={{
                                        height: `${itemHeight}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        scrollSnapAlign: 'center',
                                        fontSize: isSelected ? '1.2rem' : '1rem',
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        color: isSelected ? 'white' : '#666',
                                        background: isSelected ? '#006ce4' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        margin: '0 20px', // Visual gap
                                        borderRadius: '8px' // Rounded selection
                                    }}
                                >
                                    {opt} Passengers
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Done Button */}
                <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                    <button onClick={() => { onChange(options[selectedIndex]); onClose(); }} style={{
                        width: '100%',
                        padding: '12px',
                        background: '#006ce4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>
                        Done
                    </button>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default PassengerWheelPicker;
