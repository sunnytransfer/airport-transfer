import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        brandName: '',
        logoUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        enableTransfers: true,
        enableExcursions: false,
        enableBlog: false,
        enableWhatsApp: true,
        contactPhone: '',
        contactEmail: ''
    });

    // Admin metadata
    const [meta, setMeta] = useState({
        updated_at: null,
        published_at: null,
        version: 0
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/site-settings');
            const data = await res.json();

            // Prefer draft value, fallback to published value
            const current = data.draft_value || data.value || {};

            setSettings(prev => ({ ...prev, ...current }));
            setMeta({
                updated_at: data.updated_at,
                published_at: data.published_at,
                version: data.version
            });
            setLoading(false);
        } catch (err) {
            setMessage('Failed to load settings');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveDraft = async () => {
        setMessage('Saving...');
        try {
            const res = await fetch('/api/admin/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!res.ok) throw new Error('Save failed');
            await fetchSettings(); // Refresh meta
            setMessage('Draft saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error saving draft');
        }
    };

    const handlePublish = async () => {
        if (!window.confirm('Are you sure you want to publish these settings to the live site?')) return;

        setMessage('Publishing...');
        try {
            const res = await fetch('/api/admin/site-settings/publish', {
                method: 'POST'
            });
            if (!res.ok) throw new Error('Publish failed');
            await fetchSettings(); // Refresh meta
            setMessage('Settings published successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error publishing settings');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1f2937' }}>Site Settings</h1>

            {/* Status Bar */}
            <div style={{
                background: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    <div><strong>Last Saved:</strong> {meta.updated_at ? new Date(meta.updated_at).toLocaleString() : 'Never'}</div>
                    <div><strong>Last Published:</strong> {meta.published_at ? new Date(meta.published_at).toLocaleString() : 'Never'}</div>
                    <div><strong>Version:</strong> {meta.version}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleSaveDraft}
                        style={{
                            padding: '8px 16px',
                            background: '#e5e7eb',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Publish Live
                    </button>
                </div>
            </div>

            {message && (
                <div style={{
                    marginBottom: '20px',
                    padding: '10px',
                    background: message.includes('Error') || message.includes('Failed') ? '#fee2e2' : '#dcfce7',
                    color: message.includes('Error') || message.includes('Failed') ? '#b91c1c' : '#15803d',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                {/* Brand Identity */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Brand Identity</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Brand Name</label>
                        <input
                            type="text"
                            name="brandName"
                            value={settings.brandName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Logo URL</label>
                        <input
                            type="text"
                            name="logoUrl"
                            value={settings.logoUrl}
                            onChange={handleChange}
                            placeholder="/logo.png"
                            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Primary Color</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="color"
                                name="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                                style={{ height: '38px', width: '50px', padding: '0', border: 'none' }}
                            />
                            <input
                                type="text"
                                name="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                                style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Secondary Color</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="color"
                                name="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={handleChange}
                                style={{ height: '38px', width: '50px', padding: '0', border: 'none' }}
                            />
                            <input
                                type="text"
                                name="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={handleChange}
                                style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact Phone</label>
                        <input
                            type="text"
                            name="contactPhone"
                            value={settings.contactPhone}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact Email</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={settings.contactEmail}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {/* Feature Toggles */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Feature Toggles</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="enableTransfers"
                            checked={settings.enableTransfers}
                            onChange={handleChange}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span>Enable Transfers</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="enableExcursions"
                            checked={settings.enableExcursions}
                            onChange={handleChange}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span>Enable Excursions</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="enableBlog"
                            checked={settings.enableBlog}
                            onChange={handleChange}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span>Enable Blog</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="enableWhatsApp"
                            checked={settings.enableWhatsApp}
                            onChange={handleChange}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span>Enable WhatsApp Widget</span>
                    </label>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
