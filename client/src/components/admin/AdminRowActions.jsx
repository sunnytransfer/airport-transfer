import React, { useState } from 'react';

const AdminRowActions = ({ booking, onApprove, onDetail, isApproved }) => {
    const [copied, setCopied] = useState(false);

    const handleWhatsApp = () => {
        const message = `Hello ${booking.customer_name} ✅\nYour booking is received.\nRoute: ${booking.pickup_location} -> ${booking.dropoff_location}\nDate/Time: ${new Date(booking.pickup_time).toLocaleString()}\nPassengers: ${booking.passenger_count}\nWe will confirm shortly.`;
        const phone = booking.phone.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleCopySummary = () => {
        const flight = booking.flight_number || '-';
        const date = new Date(booking.pickup_time).toLocaleString();
        const summary = `#${booking.id} | ${booking.customer_name} | ${booking.phone} | ${date} | ${booking.pickup_location} -> ${booking.dropoff_location} | Pax:${booking.passenger_count || 1} | Flight:${flight}`;

        navigator.clipboard.writeText(summary).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="admin-row-actions">
            {!isApproved && (
                <button title="Confirm Booking" className="btn-icon btn-approve" onClick={() => onApprove(booking)}>
                    ✓ Confirm
                </button>
            )}

            <button title="WhatsApp Customer" className="btn-icon btn-whatsapp" onClick={handleWhatsApp}>
                📱
            </button>

            <button title="Copy Summary" className="btn-icon btn-copy" onClick={handleCopySummary}>
                {copied ? '✅' : 'Copy'}
            </button>

            <button title="View Details" className="btn-icon btn-detail" onClick={() => onDetail(booking)}>
                👁
            </button>
        </div>
    );
};

export default AdminRowActions;
