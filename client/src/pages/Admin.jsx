import React, { useMemo, useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import AdminSafeMessageModal from '../components/admin/AdminSafeMessageModal';
import '../admin.css';
import SiteControl from './admin/SiteControl';

const DRIVERS = [
    { name: 'Unassigned', phone: '' },
    { name: 'Ahmet Yilmaz', phone: '905551112233' },
    { name: 'Mehmet Demir', phone: '905552223344' },
    { name: 'Ali Kaya', phone: '905553334455' },
    { name: 'Mustafa Can', phone: '905554445566' }
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
    let color = '#555';
    let bg = '#eee';
    const s = (status || 'pending').toLowerCase();

    if (s === 'confirmed' || s === 'approved') { color = '#2e7d32'; bg = '#e8f5e9'; }
    if (s === 'completed') { color = '#1565c0'; bg = '#e3f2fd'; }
    if (s === 'cancelled') { color = '#c62828'; bg = '#ffebee'; }
    if (s === 'pending') { color = '#ef6c00'; bg = '#fff3e0'; }

    return (
        <span style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: '12px',
            fontSize: '11px', fontWeight: 'bold', color: color, background: bg,
            textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
            {status || 'Pending'}
        </span>
    );
};

const DriverAssign = ({ booking, onAssign }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(booking.driver_name || '');

    const handleSave = (e) => {
        e.stopPropagation();
        onAssign(booking.id, selectedDriver);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div style={{ display: 'flex', gap: '5px' }} onClick={e => e.stopPropagation()}>
                <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    style={{ padding: '4px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Select Driver...</option>
                    {DRIVERS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <button onClick={handleSave} style={{ fontSize: '10px', padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✓</button>
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} style={{ fontSize: '10px', padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
            </div>
        );
    }

    return (
        <div onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {booking.driver_name ? (
                <>
                    <span style={{ fontSize: '12px' }}>👤</span>
                    <span style={{ fontWeight: '600', color: '#003580', fontSize: '13px' }}>{booking.driver_name}</span>
                </>
            ) : (
                <span style={{ color: '#999', fontSize: '12px', fontStyle: 'italic', borderBottom: '1px dashed #ccc' }}>+ Assign</span>
            )}
        </div>
    );
};

const PricingManager = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchRules(); }, []);

    const fetchRules = () => {
        setLoading(true);
        fetch('/api/pricing-rules').then(r => r.json()).then(d => { setRules(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleUpdate = (rule) => {
        fetch(`/api/pricing-rules/${rule.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rule) })
            .then(res => res.json()).then(() => alert('Saved!'));
    };

    const handleChange = (id, field, value) => {
        setRules(rules.map(r => {
            if (r.id !== id) return r;
            const updated = { ...r, [field]: value };
            // Auto Update Return Price logic (optional, removed for manual control or keep simple)
            if (field === 'one_way_price') {
                updated.return_price = Math.round((parseFloat(value) || 0) * 2 * 0.95);
            }
            return updated;
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3>Pricing Rules</h3>
            <table className="data-table" style={{ width: '100%', marginTop: '15px' }}>
                <thead><tr style={{ textAlign: 'left', background: '#f8f9fa' }}><th style={{ padding: '10px' }}>Pax</th><th style={{ padding: '10px' }}>Vehicle</th><th style={{ padding: '10px' }}>One Way (£)</th><th style={{ padding: '10px' }}>Return (£)</th><th style={{ padding: '10px' }}>Action</th></tr></thead>
                <tbody>
                    {rules.map(r => (
                        <tr key={r.id}>
                            <td style={{ padding: '10px' }}>{r.min_pax}-{r.max_pax}</td>
                            <td style={{ padding: '10px' }}><input value={r.vehicle_name} onChange={e => handleChange(r.id, 'vehicle_name', e.target.value)} style={{ padding: '4px' }} /></td>
                            <td style={{ padding: '10px' }}><input type="number" value={r.one_way_price} onChange={e => handleChange(r.id, 'one_way_price', e.target.value)} style={{ width: '60px', padding: '4px' }} /></td>
                            <td style={{ padding: '10px' }}><input type="number" value={r.return_price} readOnly style={{ width: '60px', background: '#eee', padding: '4px' }} /></td>
                            <td style={{ padding: '10px' }}><button className="btn-success" onClick={() => handleUpdate(r)} style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DashboardTable = ({ title, bookings, type, onAction, onAssignDriver }) => {
    if (!bookings || bookings.length === 0) return null;

    // Header Colors
    let headerColor = '#003580';
    if (type === 'return') headerColor = '#d32f2f'; // Red for Returns/Departures
    if (type === 'arrival') headerColor = '#0288d1'; // Blue for Arrivals
    if (type === 'asap') headerColor = '#ed6c02'; // Orange for ASAP

    return (
        <div style={{ marginBottom: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 15px', background: headerColor, color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{title}</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{bookings.length}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6', color: '#666' }}>
                        <tr>
                            <th style={{ padding: '12px' }}>Time</th>
                            <th style={{ padding: '12px' }}>Route</th>
                            <th style={{ padding: '12px' }}>Customer</th>
                            <th style={{ padding: '12px' }}>Pax</th>
                            <th style={{ padding: '12px' }}>Price</th>
                            <th style={{ padding: '12px' }}>Driver</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => {
                            const priceVal = parseFloat(b.price || 0);
                            return (
                                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }} onClick={() => onAction(b, 'detail')}>
                                    <td style={{ padding: '12px', fontWeight: 'bold', minWidth: '80px' }}>
                                        {new Date(b.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {b.flight_time && (
                                            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                                                ✈ {new Date(b.flight_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', maxWidth: '180px', fontSize: '12px' }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }} title={b.pickup_location}>{b.pickup_location?.split(',')[0]}</span>
                                            <span style={{ color: '#999' }}>➜</span>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }} title={b.dropoff_location}>{b.dropoff_location?.split(',')[0]}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: '500' }}>{b.customer_name}</div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>{b.phone}</div>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{b.passenger_count}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: priceVal > 0 ? '#2e7d32' : '#999' }}>
                                        {priceVal > 0 ? `£${priceVal}` : <span style={{ fontSize: '10px', background: '#eee', padding: '2px 4px', borderRadius: '4px' }}>UNPRICED</span>}
                                    </td>
                                    <td style={{ padding: '12px' }}><DriverAssign booking={b} onAssign={onAssignDriver} /></td>
                                    <td style={{ padding: '12px' }}><StatusBadge status={b.status} /></td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button onClick={(e) => { e.stopPropagation(); onAction(b, 'whatsapp'); }} style={{ padding: '6px 10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>WA</button>
                                        <button onClick={(e) => { e.stopPropagation(); onAction(b, 'detail'); }} style={{ padding: '6px 10px', background: '#003580', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' }}>
            <div style={{ background: 'white', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden', animation: 'fadeIn 0.2s' }}>
                <div style={{ padding: '15px 20px', background: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Booking #{booking.id}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                </div>

                <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Customer</label>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.customer_name}</div>
                            <div style={{ color: '#003580' }}>{booking.phone}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{booking.email}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Status</label>
                            <div><StatusBadge status={booking.status} /></div>
                            <div style={{ marginTop: '10px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Price</label>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2e7d32' }}>{booking.price || 'Unpriced'}</div>
                            </div>
                        </div>
                    </div>

                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Pickup</label>
                            <div style={{ fontWeight: '600' }}>{new Date(booking.pickup_time).toLocaleString()}</div>
                            <div>{booking.pickup_location}</div>
                            {booking.flight_time && <div style={{ fontSize: '0.9rem', color: '#666' }}>✈ Flight: {new Date(booking.flight_time).toLocaleTimeString()}</div>}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Dropoff</label>
                            <div>{booking.dropoff_location}</div>
                            {booking.hotel_name && <div style={{ fontSize: '0.9rem', color: '#666' }}>🏨 {booking.hotel_name}</div>}
                        </div>
                    </div>

                    {booking.note && (
                        <div style={{ marginTop: '20px', background: '#fff3cd', padding: '10px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                            <strong style={{ color: '#856404' }}>Notes:</strong> {booking.note}
                        </div>
                    )}
                </div>

                <div style={{ padding: '15px 20px', background: '#f8f9fa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                    <button style={{ padding: '8px 16px', background: '#003580', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Open Full Booking</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN ADMIN PAGE ---

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { settings } = useSite();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [messageType, setMessageType] = useState('whatsapp_customer');
    const [viewFilter, setViewFilter] = useState('today'); // today, tomorrow, all
    const [currentView, setCurrentView] = useState('dashboard'); // dashboard, pricing, settings

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchBookings = () => {
        fetch('/api/bookings?status=active').then(res => res.json()).then(data => {
            if (data.data) setBookings(data.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const handleAssignDriver = (id, driverName) => {
        fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driver_name: driverName, status: driverName ? 'confirmed' : 'pending' })
        }).then(() => fetchBookings());
    };

    const handleAction = (booking, action) => {
        if (action === 'whatsapp') {
            setSelectedBooking(booking);
            setMessageType('whatsapp_customer');
            setMessageModalOpen(true);
        } else if (action === 'detail') {
            setSelectedBooking(booking);
        }
    };

    const dashboardData = useMemo(() => {
        if (!bookings.length) return { asap: [], todayArrivals: [], todayDepartures: [], tomorrowArrivals: [], tomorrowDepartures: [], totalRevenue: 0 };

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfTomorrow = new Date(startOfToday); startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const startOfDayAfter = new Date(startOfTomorrow); startOfDayAfter.setDate(startOfDayAfter.getDate() + 1);

        const asapThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Now + 2 hours

        const asap = [];
        const todayArrivals = [];
        const todayDepartures = []; // Returns handled here
        const tomorrowArrivals = [];
        const tomorrowDepartures = [];
        let revenue = 0;

        bookings.forEach(b => {
            const d = new Date(b.pickup_time);
            const isToday = d >= startOfToday && d < startOfTomorrow;
            const isTomorrow = d >= startOfTomorrow && d < startOfDayAfter;

            // Logic: Arrival if Pickup contains "Airport" (Dalaman usually)
            // Departure if Dropoff contains "Airport" OR is_return is active
            const isArrival = (b.pickup_location || '').toLowerCase().includes('airport');

            const priceVal = parseFloat((b.price || '0').toString().replace(/[^0-9.]/g, '')) || 0;

            // ASAP Check (Only for pending/confirmed, not completed)
            if (d > now && d < asapThreshold && b.status !== 'completed' && b.status !== 'cancelled') {
                asap.push(b);
            }

            if (isToday) {
                if (isArrival) todayArrivals.push(b);
                else todayDepartures.push(b);
                if (b.status !== 'cancelled') revenue += priceVal;
            } else if (isTomorrow) {
                if (isArrival) tomorrowArrivals.push(b);
                else tomorrowDepartures.push(b);
            }
        });

        const sorter = (a, b) => new Date(a.pickup_time) - new Date(b.pickup_time);
        return {
            asap: asap.sort(sorter),
            todayArrivals: todayArrivals.sort(sorter),
            todayDepartures: todayDepartures.sort(sorter),
            tomorrowArrivals: tomorrowArrivals.sort(sorter),
            tomorrowDepartures: tomorrowDepartures.sort(sorter),
            totalRevenue: revenue
        };
    }, [bookings]);

    return (
        <div className="container admin-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
            <AdminSafeMessageModal isOpen={messageModalOpen} onClose={() => setMessageModalOpen(false)} booking={selectedBooking} type={messageType} settings={settings} />
            {selectedBooking && !messageModalOpen && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#003580', fontWeight: 'bold' }}>Transport OPS</h1>
                </div>

                <div style={{ display: 'flex', gap: '5px', background: '#f0f2f5', padding: '5px', borderRadius: '6px' }}>
                    {['dashboard', 'pricing', 'settings'].map(view => (
                        <button
                            key={view}
                            onClick={() => setCurrentView(view)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '4px',
                                border: 'none',
                                background: currentView === view ? 'white' : 'transparent',
                                color: currentView === view ? '#003580' : '#666',
                                fontWeight: currentView === view ? 'bold' : '500',
                                boxShadow: currentView === view ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            {currentView === 'dashboard' && (
                <>
                    {/* KPI Banner */}
                    <div style={{ background: '#003580', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,53,128,0.2)' }}>
                        <div>
                            <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold', letterSpacing: '1px' }}>Live Operations</div>
                            <div style={{ fontSize: '14px', marginTop: '5px' }}>System Active • {new Date().toLocaleTimeString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>Today's Revenue</div>
                            <div style={{ fontSize: '32px', fontWeight: '800' }}>£{dashboardData.totalRevenue.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* ASAP Alert */}
                    {dashboardData.asap.length > 0 && (
                        <div style={{ marginBottom: '25px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '5px' }}>
                            <DashboardTable title={`🔥 ASAP / URGENT (Next 2 Hours)`} bookings={dashboardData.asap} type="asap" onAction={handleAction} onAssignDriver={handleAssignDriver} />
                        </div>
                    )}

                    {/* Dashboard Filters */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <button onClick={() => setViewFilter('today')} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: viewFilter === 'today' ? '#003580' : '#e0e0e0', color: viewFilter === 'today' ? 'white' : 'black', fontWeight: 'bold', cursor: 'pointer' }}>Today</button>
                        <button onClick={() => setViewFilter('tomorrow')} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: viewFilter === 'tomorrow' ? '#003580' : '#e0e0e0', color: viewFilter === 'tomorrow' ? 'white' : 'black', fontWeight: 'bold', cursor: 'pointer' }}>Tomorrow</button>
                        <button onClick={() => setViewFilter('all')} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: viewFilter === 'all' ? '#003580' : '#e0e0e0', color: viewFilter === 'all' ? 'white' : 'black', fontWeight: 'bold', cursor: 'pointer' }}>All Upcoming</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* LEFT COLUMN: ARRIVALS */}
                        <div>
                            {(viewFilter === 'today' || viewFilter === 'all') && (
                                <DashboardTable title="🛬 Today Arrivals (Airport -> Hotel)" bookings={dashboardData.todayArrivals} type="arrival" onAction={handleAction} onAssignDriver={handleAssignDriver} />
                            )}
                            {(viewFilter === 'tomorrow' || viewFilter === 'all') && (
                                <DashboardTable title="📅 Tomorrow Arrivals" bookings={dashboardData.tomorrowArrivals} type="arrival" onAction={handleAction} onAssignDriver={handleAssignDriver} />
                            )}
                        </div>

                        {/* RIGHT COLUMN: RETURNS / DEPARTURES */}
                        <div>
                            {(viewFilter === 'today' || viewFilter === 'all') && (
                                <DashboardTable title="🛫 Today Departures / Returns" bookings={dashboardData.todayDepartures} type="return" onAction={handleAction} onAssignDriver={handleAssignDriver} />
                            )}
                            {(viewFilter === 'tomorrow' || viewFilter === 'all') && (
                                <DashboardTable title="📅 Tomorrow Departures" bookings={dashboardData.tomorrowDepartures} type="return" onAction={handleAction} onAssignDriver={handleAssignDriver} />
                            )}
                        </div>
                    </div>

                    {(dashboardData.todayArrivals.length === 0 && dashboardData.todayDepartures.length === 0 && viewFilter === 'today') && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999', background: 'white', borderRadius: '8px', border: '1px dashed #ddd' }}>
                            <h3>No operations scheduled for today.</h3>
                            <p>Check "Tomorrow" or "All Upcoming" to see future jobs.</p>
                        </div>
                    )}
                </>
            )}

            {currentView === 'pricing' && <PricingManager />}
            {currentView === 'settings' && <SiteControl />}
        </div>
    );
};

export default Admin;
