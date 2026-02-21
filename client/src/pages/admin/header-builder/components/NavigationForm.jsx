import React, { useState } from 'react';
import { Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Enhanced Navigation Menu form.
 * 
 * @param {Object} props
 * @param {Array} props.navItems - The list of navigation items
 * @param {function(number, string, string): void} props.onEdit - Edit handler
 * @param {function(number): void} props.onDelete - Delete handler
 * @param {function(): void} props.onAdd - Add handler
 */
const NavigationForm = ({ navItems, onEdit, onDelete, onAdd }) => {
    const iconOptions = ['CarTaxiFront', 'Map', 'Ticket', 'BookOpen', 'Globe', 'LifeBuoy', 'Info', 'FileText', 'User', 'Phone', 'Mail', 'Star', 'Search'];

    return (
        <div className="table-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Navigation Menu</h3>
                <button
                    className="btn-action btn-detail"
                    onClick={onAdd}
                    style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <Plus size={14} /> Add Item
                </button>
            </div>

            <div className="nav-items-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {navItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #eee',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            transition: 'background 0.2s ease',
                        }}
                    >
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '10px' }}>
                            <div className="form-group-inline">
                                <label style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px', display: 'block' }}>Label</label>
                                <input
                                    className="form-input"
                                    value={item.label}
                                    onChange={e => onEdit(idx, 'label', e.target.value)}
                                    placeholder="Menu Label"
                                />
                            </div>

                            <div className="form-group-inline">
                                <label style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px', display: 'block' }}>Path</label>
                                <input
                                    className="form-input"
                                    value={item.path}
                                    onChange={e => onEdit(idx, 'path', e.target.value)}
                                    placeholder="/path"
                                />
                            </div>

                            <div className="form-group-inline">
                                <label style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px', display: 'block' }}>Icon</label>
                                <select
                                    className="form-input"
                                    value={item.icon || ''}
                                    onChange={e => onEdit(idx, 'icon', e.target.value)}
                                >
                                    <option value="">None</option>
                                    {iconOptions.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            className="btn-action btn-delete"
                            onClick={() => onDelete(idx)}
                            style={{
                                width: '32px',
                                height: '32px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            title="Remove Item"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {navItems.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px', border: '1px dashed #ddd', borderRadius: '4px' }}>
                    No navigation items yet. Click "Add Item" to start.
                </div>
            )}
        </div>
    );
};

export default NavigationForm;
