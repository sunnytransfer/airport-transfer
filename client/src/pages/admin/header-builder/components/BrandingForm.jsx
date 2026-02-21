import React from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

/**
 * @typedef {Object} BrandingProps
 * @property {string} siteTitle - The title of the website
 * @property {string} logoUrl - URL of the uploaded logo
 * @property {string} tagline - Optional tagline
 * @property {boolean} sticky - Whether the header is sticky
 */

/**
 * Form for editing branding settings.
 * 
 * @param {Object} props
 * @param {BrandingProps} props.settings - The current branding settings
 * @param {function(string, any): void} props.onChange - Handler for field updates
 * @param {function(string, string): void} props.onToast - Handler for showing toast notifications
 * @param {function(boolean): void} props.setSaving - Handler for updating saving state
 */
const BrandingForm = ({ settings, onChange, onToast, setSaving }) => {

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setSaving(true);
        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Invalid file type. Please upload an image.');
            }

            // Validate file size (e.g., 2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('File too large. Maximum size is 2MB.');
            }

            const res = await axios.post('/api/upload', formData);
            onChange('logoUrl', res.data.url);
            onToast('Image uploaded successfully', 'success');
        } catch (err) {
            console.error(err);
            onToast(err.message || 'Upload failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="table-card" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Branding</h3>

            <div className="form-group">
                <label htmlFor="siteTitle">Site Title</label>
                <input
                    id="siteTitle"
                    type="text"
                    className="form-input"
                    value={settings.siteTitle || ''}
                    onChange={e => onChange('siteTitle', e.target.value)}
                    placeholder="e.g. MarmarisTrip"
                />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {settings.logoUrl && (
                        <img
                            src={settings.logoUrl}
                            alt="Logo Preview"
                            style={{ height: '40px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    )}
                    <label className="btn-filter" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Upload size={14} style={{ marginRight: '5px' }} />
                        Upload Logo
                        <input
                            type="file"
                            hidden
                            onChange={handleLogoUpload}
                            accept="image/png, image/jpeg, image/webp"
                        />
                    </label>
                </div>
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    Recommended: PNG or WebP, max height 40px.
                </small>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Sticky Header</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={settings.sticky === true}
                        onChange={e => onChange('sticky', e.target.checked)}
                    />
                    Enable sticky header on scroll
                </label>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Header Background Color</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="color"
                        className="form-input"
                        style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                        value={settings.backgroundColor || '#ffffff'}
                        onChange={e => onChange('backgroundColor', e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{settings.backgroundColor || '#ffffff'}</span>
                </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Currency Selector</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={settings.showCurrency !== false}
                        onChange={e => onChange('showCurrency', e.target.checked)}
                    />
                    Show Currency Selector
                </label>
            </div>

            <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.85rem', color: '#666' }}>
                <strong>Tip:</strong> If you use a white background, the domain text will be dark blue. If you use a dark background (like #003580), text will be white.
            </div>
        </div>
    );
};

export default BrandingForm;
