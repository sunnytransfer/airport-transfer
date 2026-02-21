import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    MapPin,
    Map,
    Car,
    UserCog,
    Banknote,
    Globe,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronRight,
    Star
} from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({
        'Bookings': true,
        'Pricing': false,
        'Website Control': false,
        'Messages': false,
        'Settings': false
    });

    const toggleGroup = (label) => {
        setExpandedGroups(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const isActive = (path) => location.pathname === path;
    const isGroupActive = (children) => children.some(child => location.pathname.startsWith(child.path));

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        {
            label: 'Bookings',
            icon: CalendarDays,
            children: [
                { path: '/admin/bookings/transfers', label: 'Transfers' },
                { path: '/admin/bookings/tours', label: 'Tours' }
            ]
        },
        { path: '/admin/locations', label: 'Locations', icon: MapPin, important: true },
        { path: '/admin/routes', label: 'Routes', icon: Map, important: true },
        { path: '/admin/vehicles', label: 'Vehicles', icon: Car },
        { path: '/admin/drivers', label: 'Drivers', icon: UserCog },
        {
            label: 'Pricing',
            icon: Banknote,
            children: [
                { path: '/admin/pricing/routes', label: 'Route Pricing' },
                { path: '/admin/pricing/return-rules', label: 'Return Rules' }
            ]
        },
        {
            label: 'Website Control',
            icon: Globe,
            children: [
                { path: '/admin/content/pages', label: 'Pages' },
                { path: '/admin/content/media', label: 'Media' },
                { path: '/admin/content/text', label: 'Text Edit' }
            ]
        },
        {
            label: 'Messages',
            icon: MessageSquare,
            children: [
                { path: '/admin/messages/email', label: 'Email' },
                { path: '/admin/messages/whatsapp', label: 'WhatsApp' }
            ]
        },
        {
            label: 'Settings',
            icon: Settings,
            children: [
                { path: '/admin/settings/currency', label: 'Currency' },
                { path: '/admin/settings/users', label: 'Users (Staff)' },
                { path: '/admin/settings/general', label: 'General' }
            ]
        }
    ];

    const renderNavItem = (item, index) => {
        if (item.children) {
            const isExpanded = expandedGroups[item.label] || isGroupActive(item.children); // Auto expand if active

            return (
                <div key={index} style={{ marginBottom: '4px' }}>
                    <div
                        onClick={() => toggleGroup(item.label)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 20px',
                            color: isGroupActive(item.children) ? '#fff' : '#94a3b8',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            userSelect: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <item.icon size={20} />
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </div>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {isExpanded && (
                        <div style={{ background: '#0f172a' }}>
                            {item.children.map((child, childIndex) => (
                                <Link
                                    key={childIndex}
                                    to={child.path}
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px 10px 52px',
                                        color: isActive(child.path) ? '#60a5fa' : '#94a3b8',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        const isItemActive = isActive(item.path);

        return (
            <Link
                key={index}
                to={item.path}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    color: isItemActive ? '#fff' : '#94a3b8',
                    textDecoration: 'none',
                    background: isItemActive ? '#334155' : 'transparent',
                    borderLeft: isItemActive ? '4px solid #3b82f6' : '4px solid transparent',
                    marginBottom: '4px',
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <item.icon size={20} />
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                </div>
                {item.important && (
                    <Star size={16} fill="#eab308" color="#eab308" />
                )}
            </Link>
        );
    };

    return (
        <aside style={{
            width: '260px',
            background: '#1e293b',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #334155',
            flexShrink: 0,
            overflowY: 'auto',
            maxHeight: '100vh'
        }}>
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #334155',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.5px'
            }}>
                MarmarisTrip
            </div>

            <nav style={{ flex: 1, padding: '20px 0' }}>
                {navItems.map((item, index) => renderNavItem(item, index))}
            </nav>

            <div style={{ padding: '20px', color: '#64748b', fontSize: '0.8rem', textAlign: 'center', borderTop: '1px solid #334155' }}>
                Admin Panel v1.0
            </div>
        </aside>
    );
};

export default AdminSidebar;
