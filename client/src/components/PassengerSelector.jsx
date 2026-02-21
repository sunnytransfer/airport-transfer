import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../index.css'; // Ensure we have the styles

const PassengerSelector = ({ isOpen, onClose, currentCount, onSelect }) => {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="passenger-popup-backdrop" onClick={onClose}>
            <div className="passenger-popup" onClick={(e) => e.stopPropagation()}>
                <div className="passenger-list-title">No. of passengers</div>
                <div className="passenger-list-container">
                    {[...Array(16)].map((_, i) => { // Limited to 16 as requested
                        const count = i + 1;
                        const isSelected = currentCount === count;
                        return (
                            <div
                                key={count}
                                className={`passenger-option ${isSelected ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(count);
                                    onClose();
                                }}
                            >
                                {isSelected ? (
                                    <span className="check-mark">✓</span>
                                ) : (
                                    <span style={{ width: '20px', display: 'inline-block' }}></span>
                                )}
                                <span className="passenger-text">
                                    {count} {count === 1 ? 'passenger' : 'passengers'}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Apply Button */}
                <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                    <button
                        type="button"
                        className="apply-btn"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#006ce4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PassengerSelector;
