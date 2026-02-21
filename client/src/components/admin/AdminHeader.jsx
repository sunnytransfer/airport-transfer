import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AdminHeader = () => {
    return (
        <header style={{
            height: '60px',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1a202c' }}>
                Admin Panel
            </div>
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: '#4a5568',
                fontSize: '0.9rem',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'background 0.2s'
            }}>
                <LogOut size={18} />
                <span>Back to Site</span>
            </Link>
        </header>
    );
};

export default AdminHeader;
