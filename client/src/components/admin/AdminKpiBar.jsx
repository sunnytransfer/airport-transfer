import React, { useMemo } from 'react';

const AdminKpiBar = ({ bookings, onFilterClick, activeFilter }) => {
    const stats = useMemo(() => {
        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        return bookings.reduce((acc, b) => {
            const status = (b.status || 'pending').toLowerCase();
            const payment = (b.payment_status || 'pending').toLowerCase();
            const pickupTime = new Date(b.pickup_time);

            // Waiting
            if (status === 'pending') acc.waiting++;

            // Confirmed/Approved
            if (status === 'confirmed' || status === 'approved') acc.confirmed++;

            // Completed
            if (status === 'completed') acc.completed++;

            // Payment Pending
            if (payment === 'pending') acc.paymentPending++;

            // Urgent: pickup in future < 3h, not completed/cancelled
            if (pickupTime > now && pickupTime < threeHoursLater && status !== 'completed' && status !== 'cancelled') {
                acc.urgent++;
            }

            return acc;
        }, { waiting: 0, confirmed: 0, completed: 0, paymentPending: 0, urgent: 0 });
    }, [bookings]);

    const kpiItems = [
        { key: 'waiting', label: 'Waiting', count: stats.waiting, color: '#f57f17', bg: '#fff3cd' },
        { key: 'confirmed', label: 'Confirmed', count: stats.confirmed, color: '#155724', bg: '#d4edda' },
        { key: 'completed', label: 'Completed', count: stats.completed, color: '#333', bg: '#e2e3e5' },
        { key: 'paymentPending', label: 'Payment Pending', count: stats.paymentPending, color: '#856404', bg: '#fff3cd' },
        { key: 'urgent', label: 'Urgent (<3h)', count: stats.urgent, color: '#721c24', bg: '#f8d7da' }
    ];

    return (
        <div className="admin-kpi-bar">
            {kpiItems.map(item => (
                <div
                    key={item.key}
                    className={`kpi-card ${activeFilter === item.key ? 'active' : ''}`}
                    onClick={() => onFilterClick(activeFilter === item.key ? 'all' : item.key)}
                    style={{
                        borderLeft: `4px solid ${item.color}`,
                        backgroundColor: activeFilter === item.key ? '#eef2ff' : 'white'
                    }}
                >
                    <span className="kpi-label">{item.label}</span>
                    <span className="kpi-count" style={{ color: item.color }}>{item.count}</span>
                </div>
            ))}
        </div>
    );
};

export default AdminKpiBar;
