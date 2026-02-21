import React from 'react';

/**
 * @typedef {Object} ContactSettings
 * @property {string} phone
 * @property {string} email
 */

/**
 * @typedef {Object} SocialsSettings
 * @property {string} facebook
 * @property {string} instagram
 * @property {string} tiktok
 * @property {string} youtube
 */

/**
 * Form for contact and social media settings.
 * 
 * @param {Object} props
 * @param {ContactSettings} props.contact - Contact settings
 * @param {SocialsSettings} props.socials - Social media settings
 * @param {function(string, string, any): void} props.onChange - Handler for nested updates (parent, field, value)
 */
const ContactSocialsForm = ({ contact, socials, onChange }) => {
    return (
        <div className="table-card" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Contact & Socials</h3>

            <div className="detail-form-grid" style={{ gridTemplateColumns: '1fr 1fr', padding: 0, boxShadow: 'none' }}>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        className="form-input"
                        value={contact.phone || ''}
                        onChange={e => onChange('contact', 'phone', e.target.value)}
                        placeholder="+90 555 123 4567"
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        value={contact.email || ''}
                        onChange={e => onChange('contact', 'email', e.target.value)}
                        placeholder="info@example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Facebook URL</label>
                    <input
                        type="url"
                        className="form-input"
                        value={socials.facebook || ''}
                        onChange={e => onChange('socials', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                    />
                </div>
                <div className="form-group">
                    <label>Instagram URL</label>
                    <input
                        type="url"
                        className="form-input"
                        value={socials.instagram || ''}
                        onChange={e => onChange('socials', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                    />
                </div>
                <div className="form-group">
                    <label>TikTok URL</label>
                    <input
                        type="url"
                        className="form-input"
                        value={socials.tiktok || ''}
                        onChange={e => onChange('socials', 'tiktok', e.target.value)}
                        placeholder="https://tiktok.com/..."
                    />
                </div>
                <div className="form-group">
                    <label>YouTube URL</label>
                    <input
                        type="url"
                        className="form-input"
                        value={socials.youtube || ''}
                        onChange={e => onChange('socials', 'youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactSocialsForm;
