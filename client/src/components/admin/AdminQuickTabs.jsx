import React, { useMemo } from 'react';

const AdminQuickTabs = ({ activeFilter, filterCounts, onFilterClick }) => {
    const filters = [
        { key: 'today', label: 'Today', count: filterCounts.today },
        { key: 'tomorrow', label: 'Tomorrow', count: filterCounts.tomorrow },
        { key: 'waiting', label: 'Waiting', count: filterCounts.waiting },
        { key: 'urgent', label: 'Urgent', count: filterCounts.urgent },
        { key: 'all', label: 'All', count: filterCounts.all }
    ];

    return (
        <div className="admin-quick-tabs">
            {filters.map(f => (
                <button
                    key={f.key}
                    onClick={() => onFilterClick(f.key)}
                    className={`tab-btn ${activeFilter === f.key ? 'active' : ''}`}
                >
                    {f.label} ({f.count})
                </button>
            ))}
        </div>
    );
};

export default AdminQuickTabs;
