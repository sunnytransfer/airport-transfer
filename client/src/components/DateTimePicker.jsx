import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Clock, Calendar as CalendarIcon } from 'lucide-react';

const DateTimePicker = ({ dateValue, timeValue, onDateChange, onTimeChange, minDate = new Date(), isOpen, onToggle }) => {
    // const [isOpen, setIsOpen] = useState(false); // Removed local state for controlled behavior
    const [viewDate, setViewDate] = useState(new Date(dateValue || new Date()));
    const dropdownRef = useRef(null);

    // Initial load
    useEffect(() => {
        if (dateValue) setViewDate(new Date(dateValue));
    }, [dateValue]);

    // Format display
    const formatDateDisplay = (dateStr, timeStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        // Format: "Wed 18, Feb, 12:00"
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = d.getDate();
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        return `${dayName} ${dayNum}, ${monthName}, ${timeStr}`;
    };

    // Calendar Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 = Sun

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getFirstDayOfMonth(year, month); // 0-6
        const days = [];

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = currentDayStr === dateValue;
            const isToday = new Date().toISOString().split('T')[0] === currentDayStr;

            days.push(
                <div
                    key={d}
                    className={`cal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => {
                        onDateChange(currentDayStr);
                        // Don't close, user picks time next
                    }}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    // Time Slots (30 min intervals)
    const generateTimeSlots = () => {
        const slots = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) { // 30 min step
                const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                slots.push(timeStr);
            }
        }
        return slots;
    };

    // Click Outside logic for DESKTOP (inline dropdown)
    // For mobile (portal), the backdrop handles it.
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (window.innerWidth <= 768) return; // Mobile handled by backdrop
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                if (isOpen) onToggle();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    const dropdownContent = (
        <div className="dt-dropdown" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="dt-header">
                <button className="dt-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                <span className="dt-title">
                    {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button className="dt-nav-btn" onClick={handleNextMonth}><ChevronRight size={20} /></button>
                {/* Mobile Close X */}
                <button className="dt-close-mobile" onClick={onToggle}>
                    <X size={20} />
                </button>
            </div>

            {/* Weekdays */}
            <div className="cal-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="cal-weekday">{d}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="cal-grid">
                {renderCalendar()}
            </div>

            {/* Divider */}
            <div className="dt-divider"></div>

            {/* Time Selector (Dropdowns) */}
            <div className="time-section">
                <div className="time-header">
                    <Clock size={16} />
                    {/* <span>Pick up time</span> */}
                </div>
                <div className="time-selectors">
                    {/* Hour Selector */}
                    <select
                        className="time-select"
                        value={timeValue.split(':')[0]}
                        onChange={(e) => {
                            const newHour = e.target.value;
                            const currentMin = timeValue.split(':')[1] || '00';
                            onTimeChange(`${newHour}:${currentMin}`);
                        }}
                    >
                        {Array.from({ length: 24 }).map((_, i) => {
                            const h = String(i).padStart(2, '0');
                            return <option key={h} value={h}>{h}</option>;
                        })}
                    </select>
                    <span className="time-colon">:</span>
                    {/* Minute Selector */}
                    <select
                        className="time-select"
                        value={timeValue.split(':')[1]}
                        onChange={(e) => {
                            const currentHour = timeValue.split(':')[0] || '12';
                            const newMin = e.target.value;
                            onTimeChange(`${currentHour}:${newMin}`);
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => {
                            const m = String(i * 5).padStart(2, '0'); // 5 minute steps
                            return <option key={m} value={m}>{m}</option>;
                        })}
                    </select>
                </div>
            </div>

            {/* Done Button */}
            <button className="dt-done-btn-blue" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                Done
            </button>
        </div>
    );

    return (
        <div className="dt-picker-root" ref={dropdownRef}>
            {/* Trigger input */}
            <div className="dt-trigger" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                <CalendarIcon size={18} className="dt-icon" />
                <span className="dt-text">
                    {dateValue ? formatDateDisplay(dateValue, timeValue) : 'Select Date'}
                </span>
            </div>

            {/* Render Logic: 
                Mobile -> Portal to Body 
                Desktop -> Inline Absolute
            */}
            {isOpen && (
                <>
                    {/* Mobile Portal Wrapper - Rendered via Portal to escape parent stacking contexts */}
                    {createPortal(
                        <div className="dt-portal-mobile-wrapper">
                            <div className="dt-backdrop" onClick={onToggle}></div>
                            {dropdownContent}
                        </div>,
                        document.body
                    )}

                    {/* Desktop Inline Wrapper (Only visible on desktop via CSS, still inside stacking context) */}
                    <div className="dt-inline-desktop-wrapper">
                        {dropdownContent}
                    </div>
                </>
            )}

            <style>{`
                .dt-picker-root { position: relative; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
                .dt-trigger { 
                    display: flex; align-items: center; gap: 8px; width: 100%; height: 100%; 
                    cursor: pointer; user-select: none; padding: 0; background: transparent; 
                }
                .dt-icon { color: #555; }
                .dt-text { font-size: 0.95rem; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* Common Dropdown Styles */
                .dt-dropdown {
                    background: white; border-radius: 8px; border: 1px solid #ddd;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 16px; 
                    display: flex; flex-direction: column; gap: 12px;
                }

                .dt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .dt-title { font-weight: 700; font-size: 1rem; color: #333; }
                .dt-nav-btn { background: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 4px; }
                .dt-nav-btn:hover { background: #f0f0f0; }

                .cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 4px; }
                .cal-weekday { font-size: 0.8rem; color: #888; font-weight: 500; }
                .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 4px; }
                .cal-cell { 
                    height: 36px; display: flex; align-items: center; justify-content: center; 
                    font-size: 0.9rem; cursor: pointer; border-radius: 4px; color: #333;
                }
                .cal-cell:hover:not(.empty):not(.selected) { background: #f0f0f0; }
                .cal-cell.selected { background: #003580; color: white; font-weight: 700; }
                .cal-cell.today { border: 1px solid #003580; }
                .cal-cell.empty { cursor: default; }

                .dt-divider { height: 1px; background: #eee; margin: 4px 0; }

                .time-section { display: flex; flex-direction: column; gap: 8px; align-items: center; }
                .time-header { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 600; color: #555; align-self: flex-start; }
                .time-selectors { display: flex; align-items: center; gap: 8px; }
                .time-select {
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                    color: #333;
                    outline: none; cursor: pointer; background: white;
                }
                .time-select:focus { border-color: #003580; }
                .time-colon { font-weight: 700; color: #333; }

                .dt-done-btn-blue {
                    width: 100%; padding: 10px; background: #003580; color: white; 
                    border: none; border-radius: 4px; font-weight: 600; font-size: 1rem; 
                    cursor: pointer; text-align: center;
                }
                .dt-done-btn-blue:hover { background: #002c70; }

                .dt-close-mobile { display: none; }
                .dt-backdrop { display: none; }
                .dt-portal-mobile-wrapper { display: none; }
                
                /* Desktop Inline Position */
                .dt-inline-desktop-wrapper .dt-dropdown {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 300px; z-index: 2000;
                }

                /* Mobile Overrides */
                @media (max-width: 768px) {
                    .dt-inline-desktop-wrapper { display: none !important; }
                    .dt-portal-mobile-wrapper { display: block !important; position: fixed; inset: 0; z-index: 9999; }
                    
                    .dt-backdrop { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; }
                    
                    /* The Modal itself in Portal */
                    .dt-portal-mobile-wrapper .dt-dropdown {
                        position: fixed; top: auto; bottom: 0; left: 0; right: 0; width: 100%;
                        border-radius: 16px 16px 0 0; padding: 20px; z-index: 10000; margin: 0;
                        animation: slideUpDt 0.3s ease-out; max-height: 85vh; overflow-y: auto;
                        border: none;
                        padding-bottom: 30px; /* Safe area */
                    }

                    .dt-close-mobile { display: block; background: transparent; border: none; padding: 4px; }
                    .dt-header { margin-bottom: 16px; }
                    .cal-cell { height: 44px; font-size: 1.1rem; }
                    
                    /* Larger touch targets */
                    .time-select { padding: 10px 16px; font-size: 1.1rem; }
                    .dt-done-btn-blue { padding: 14px; font-size: 1.1rem; }
                }

                @keyframes slideUpDt { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default DateTimePicker;
