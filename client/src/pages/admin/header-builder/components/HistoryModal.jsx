import React from 'react';

/**
 * @typedef {Object} HistoryItem
 * @property {string} timestamp - ISO timestamp string
 * @property {any} value - The configuration value at that time
 */

/**
 * Modal to display version history.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {HistoryItem[]} props.history - List of history items
 * @param {function(): void} props.onClose - Handler to close the modal
 * @param {function(number): void} props.onRestore - Handler to restore a version
 */
const HistoryModal = ({ isOpen, history, onClose, onRestore }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
            <div className="table-card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Version History</h3>
                    <button className="btn-action" onClick={onClose} style={{ background: '#333' }}>Close</button>
                </div>
                {history.length === 0 ? <p>No history available.</p> : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((ver, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(ver.timestamp).toLocaleString()}</td>
                                    <td>
                                        <button className="btn-action btn-detail" onClick={() => onRestore(idx)} style={{ width: 'auto' }}>Restore</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HistoryModal;
