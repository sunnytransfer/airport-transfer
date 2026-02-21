import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';

const SiteControl = () => {
    const [activeTab, setActiveTab] = useState('company');
    const { settings, updateSetting } = useSite();

    // Tab List
    const tabs = [
        { id: 'company', label: 'Company Info' },
        { id: 'content', label: 'Content & SEO' },
        { id: 'media', label: 'Media Library' },
        { id: 'messages', label: 'Messages' },
    ];

    // Helpers
    const InputC = ({ label, field, placeholder }) => (
        <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>
            <input
                className="form-input"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                value={settings[field] || ''}
                onChange={e => updateSetting(field, e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    const TextareaC = ({ label, field, placeholder, height = '80px' }) => (
        <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>
            <textarea
                className="form-input"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height }}
                value={settings[field] || ''}
                onChange={e => updateSetting(field, e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#003580', marginBottom: '15px' }}>Site Control Center</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === tab.id ? '#003580' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '4px 4px 0 0',
                            cursor: 'pointer',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}

            {/* 1. COMPANY TAB */}
            {activeTab === 'company' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>Identity</h3>
                        <InputC label="Company Name" field="company_name" placeholder="MarmarisTrip" />
                        <InputC label="Site Header Title" field="siteTitle" placeholder="MarmarisTrip" />
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>Contact</h3>
                        <InputC label="Phone (International Format, no +)" field="company_phone" placeholder="905551234567" />
                        <InputC label="WhatsApp (clean number)" field="company_whatsapp" placeholder="905551234567" />
                        <InputC label="Public Email" field="company_email" placeholder="info@marmaristrip.com" />
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>Notifications</h3>
                        <InputC label="Admin Notification Email" field="admin_notification_email" placeholder="admin@marmaristrip.com" />
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Where new booking alerts are sent.</p>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>Social Media Links</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <InputC label="Facebook URL" field="social_facebook" placeholder="https://facebook.com/..." />
                            <InputC label="Instagram URL" field="social_instagram" placeholder="https://instagram.com/..." />
                            <InputC label="TikTok URL" field="social_tiktok" placeholder="https://tiktok.com/..." />
                            <InputC label="YouTube URL" field="social_youtube" placeholder="https://youtube.com/..." />
                        </div>
                    </div>
                </div>
            )}

            {/* 2. CONTENT TAB */}
            {activeTab === 'content' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <InputC label="Home Hero Title" field="homeTitle" placeholder="Your Journey, Your Experience" />
                        <InputC label="Home Hero Subtitle" field="homeSubtitle" placeholder="Airport Taxi & Excursions" />
                        <InputC label="Footer Text" field="footerText" placeholder="&copy; 2024 Private Transfer Service..." />
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>SEO Defaults</h3>
                        <InputC label="Global Meta Title" field="seoTitle" placeholder="Marmaris Airport Transfers" />
                        <TextareaC label="Global Meta Description" field="seoDescription" placeholder="Book reliable transfers..." />
                    </div>
                </div>
            )}

            {/* 3. MEDIA TAB */}
            {activeTab === 'media' && <MediaManager />}

            {/* 4. MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>WhatsApp Templates</h3>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>Available variables: {'{customer}'}, {'{pickup_time}'}, {'{pickup}'}, {'{dropoff}'}, {'{driver_name}'}, {'{driver_phone}'}, {'{price}'}</p>

                        <TextareaC label="Customer Confirmation Template" field="wa_template_confirmation" height="100px" placeholder="Hello {customer}, your booking is confirmed..." />
                        <TextareaC label="Driver Assignment Template (to Customer)" field="wa_template_driver_assign" height="100px" placeholder="Your driver {driver_name} has been assigned..." />
                    </div>

                    <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Email Templates</h3>
                        <InputC label="Confirmation Subject" field="email_subject_confirmation" placeholder="Booking Confirmation" />
                        <TextareaC label="Confirmation Body (HTML supported)" field="email_body_confirmation" height="150px" placeholder="<p>Dear {customer}...</p>" />
                    </div>
                </div>
            )}
        </div>
    );
};

const MediaManager = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('/api/media').then(res => res.json()).then(data => {
            if (data.data) setImages(data.data);
        });
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);

        fetch('/api/upload', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    // Refresh list (optimistic or re-fetch)
                    fetch('/api/media').then(res => res.json()).then(d => d.data && setImages(d.data));
                }
            });
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                <p>Drag & Drop or Click to Upload</p>
                <input type="file" onChange={handleUpload} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {images.map(img => (
                    <div key={img.id} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={img.optimized_path || `/uploads/${img.filename}`} alt="upload" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                        <button
                            style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: '0.8rem', cursor: 'pointer', padding: '4px' }}
                            onClick={() => {
                                navigator.clipboard.writeText(img.optimized_path || `/uploads/${img.filename}`);
                                alert('URL Copied!');
                            }}
                        >
                            Copy URL
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SiteControl;
