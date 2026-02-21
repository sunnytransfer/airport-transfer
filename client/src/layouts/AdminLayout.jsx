import { useNavigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();

    // Menu Structure
    const menuItems = [
        { label: 'Dashboard', path: '/admin', icon: '📊' },
        { label: 'Bookings', path: '/admin/bookings', icon: '📅' },
        { label: 'Drivers', path: '/admin/drivers', icon: '🚗' },
        { label: 'Pricing', path: '/admin/pricing', icon: '💷' },
        { label: 'Site Control', path: '/admin/site-control', icon: '🌐' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>
            {/* SIDEBAR */}
            <aside style={{
                width: '260px',
                background: '#1a202c', // Dark modern sidebar
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '25px', borderBottom: '1px solid #2d3748' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>
                        ADMIN PANEL
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '5px' }}>
                        Operations Center
                    </div>
                </div>

                <nav style={{ padding: '20px 0', flex: 1 }}>
                    {/* Direct Links for standard nav */}
                    <div style={{ padding: '10px 25px', cursor: 'pointer', color: 'white', display: 'flex', gap: '10px' }} onClick={() => navigate('/admin')}>
                        <span>📊</span> Dashboard
                    </div>
                    <div style={{ padding: '10px 25px', cursor: 'pointer', color: 'white', display: 'flex', gap: '10px' }} onClick={() => navigate('/admin/header')}>
                        <span>🎨</span> Header Builder
                    </div>
                    <div style={{ padding: '10px 25px', cursor: 'pointer', color: 'white', display: 'flex', gap: '10px' }} onClick={() => navigate('/admin/settings')}>
                        <span>⚙️</span> Site Settings
                    </div>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #2d3748' }}>
                    <button onClick={() => navigate('/')} style={{
                        width: '100%', padding: '10px', background: '#2d3748', border: 'none', borderRadius: '4px',
                        color: 'white', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <span>🔙</span> Back to Website
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '30px', maxWidth: 'calc(100% - 260px)' }}>
                <Outlet />
                {/* 
                   Admin.jsx is passed as children. 
                   It contains the dashboard/pricing/settings switcher internally.
                   So this layout just provides the wrapper.
                */}
            </main>
        </div>
    );
};

export default AdminLayout;
