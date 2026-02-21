import React from 'react';

/**
 * @typedef {Object} CtaSettings
 * @property {string} label
 * @property {string} path
 * @property {string} color
 * @property {string} textColor
 * @property {string} icon
 * @property {boolean} enabled
 */

/**
 * Form for primary CTA button settings.
 * 
 * @param {Object} props
 * @param {CtaSettings} props.cta - The CTA settings object
 * @param {function(string, string, any): void} props.onChange - Handler for property updates (parent, field, value)
 */
const CtaForm = ({ cta, onChange }) => {
    return (
        <div className="table-card" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Primary CTA Button</h3>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={cta.enabled !== false}
                        onChange={e => onChange('cta', 'enabled', e.target.checked)}
                    />
                    Enabled
                </label>
            </div>

            <div className="detail-form-grid" style={{ gridTemplateColumns: '1fr 1fr', padding: 0, boxShadow: 'none' }}>
                <div className="form-group">
                    <label>Label</label>
                    <input
                        type="text"
                        className="form-input"
                        value={cta.label || ''}
                        onChange={e => onChange('cta', 'label', e.target.value)}
                        placeholder="e.g. Log in"
                    />
                </div>
                <div className="form-group">
                    <label>Link / Path</label>
                    <input
                        type="text"
                        className="form-input"
                        value={cta.path || ''}
                        onChange={e => onChange('cta', 'path', e.target.value)}
                        placeholder="/admin"
                    />
                </div>
                <div className="form-group">
                    <label>Background Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="color"
                            className="form-input"
                            style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                            value={cta.color || '#003580'}
                            onChange={e => onChange('cta', 'color', e.target.value)}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{cta.color || '#003580'}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Text Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="color"
                            className="form-input"
                            style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                            value={cta.textColor || '#ffffff'}
                            onChange={e => onChange('cta', 'textColor', e.target.value)}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{cta.textColor || '#ffffff'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CtaForm;
