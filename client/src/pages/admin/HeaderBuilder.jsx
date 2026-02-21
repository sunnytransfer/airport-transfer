import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Globe, History, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

// Sub-components for modularity
import BrandingForm from './header-builder/components/BrandingForm';
import NavigationForm from './header-builder/components/NavigationForm';
import ContactSocialsForm from './header-builder/components/ContactSocialsForm';
import CtaForm from './header-builder/components/CtaForm';
import HistoryModal from './header-builder/components/HistoryModal';

import '../../admin.css';

/**
 * Main Header Builder Page for Admin.
 * Manages state, API interactions, and composes sub-forms.
 */
const HeaderBuilder = () => {
    // --- Constants ---
    const defaultSettings = {
        siteTitle: '',
        logoUrl: '',
        tagline: '',
        contact: { phone: '', email: '' },
        socials: { facebook: '', instagram: '', tiktok: '', youtube: '' },
        navItems: [
            { label: 'Private Airport Transfers', path: '/', icon: 'CarTaxiFront' },
            { label: 'Excursions', path: '/excursions', icon: 'Map' }
        ],
        cta: { label: 'Log in', path: '/admin', icon: 'User', color: '', enabled: true },
        sticky: true
    };

    // --- State Management ---
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // History & Persistence State
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [lastPublished, setLastPublished] = useState(null);

    // UI State
    const [previewMode, setPreviewMode] = useState('desktop');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // --- Effects ---
    useEffect(() => {
        fetchSettings();
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // --- Helpers ---
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // --- API Interactions ---
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/admin/settings/header?t=${Date.now()}`);
            if (res.data.data) {
                // Parse and sanitize data
                let rawData = JSON.stringify(res.data.data);
                if (rawData.includes('Pessenger')) {
                    rawData = rawData.replace(/Pessenger/g, 'Passenger');
                }
                const data = JSON.parse(rawData);
                const { draft_value, value, history, updated_at, published_at } = data;

                // Update Timestamps
                setLastSaved(updated_at);
                setLastPublished(published_at || (value && !draft_value ? updated_at : null));

                // Merge with defaults
                const sourceData = draft_value || value || {};
                setSettings(prev => ({
                    ...defaultSettings,
                    ...sourceData,
                    contact: { ...defaultSettings.contact, ...(sourceData.contact || {}) },
                    socials: { ...defaultSettings.socials, ...(sourceData.socials || {}) },
                    cta: { ...defaultSettings.cta, ...(sourceData.cta || {}) },
                    navItems: Array.isArray(sourceData.navItems) ? sourceData.navItems : defaultSettings.navItems
                }));

                setHistory(history || []);
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        if (saving) return;
        setSaving(true);
        try {
            // Filter empty items for clean data
            const cleanNavItems = settings.navItems.filter(item => item.label.trim() !== '' || item.path.trim() !== '');

            const cleanSettings = {
                ...settings,
                navItems: cleanNavItems.map(item => ({
                    label: item.label,
                    path: item.path,
                    icon: item.icon || ''
                }))
            };

            // Optimistic update of local state
            setSettings(prev => ({ ...prev, navItems: cleanNavItems }));

            await axios.put('/api/admin/settings/header/draft', { draft_value: cleanSettings });
            showToast('Draft saved successfully!', 'success');

            // Refresh to update timestamps
            fetchSettings();
        } catch (err) {
            console.error(err);
            showToast('Error saving draft', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (saving) return;
        if (!window.confirm('Are you sure you want to publish these changes? This will go live immediately.')) return;

        setSaving(true);
        try {
            // 1. Ensure Draft is saved first
            const cleanNavItems = settings.navItems.filter(item => item.label.trim() !== '' || item.path.trim() !== '');
            const cleanSettings = { ...settings, navItems: cleanNavItems };

            await axios.put('/api/admin/settings/header/draft', { draft_value: cleanSettings });

            // 2. Publish
            await axios.post('/api/admin/settings/header/publish');
            showToast('Published successfully! Please refresh the live site (Ctrl+F5) to see changes.', 'success');

            // 3. Refresh
            await fetchSettings();
        } catch (err) {
            console.error(err);
            showToast('Error publishing changes', 'error');
            setSaving(false);
        }
    };

    const handleRevert = async () => {
        if (saving) return;
        if (!window.confirm('Discard all draft changes and revert to the last published version?')) return;

        setSaving(true);
        try {
            await axios.post('/api/admin/settings/header/revert');
            await fetchSettings();
            showToast('Reverted to published version.', 'success');
        } catch (err) {
            showToast('Failed to revert', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleRollback = async (index) => {
        if (saving) return;
        if (!window.confirm('Restore this version? It will become the new draft.')) return;

        setSaving(true);
        try {
            await axios.post('/api/admin/settings/header/rollback', { versionIndex: index });
            await fetchSettings();
            setShowHistory(false);
            showToast('History version restored to draft.', 'success');
        } catch (err) {
            showToast('Failed to rollback', 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Form Handlers ---
    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setSettings(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleNavEdit = (index, field, value) => {
        const newItems = [...settings.navItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setSettings(prev => ({ ...prev, navItems: newItems }));
    };

    const handleNavAdd = () => {
        setSettings(prev => ({
            ...prev,
            navItems: [...prev.navItems, { label: 'New Link', path: '/', icon: 'Map' }]
        }));
    };

    const handleNavDelete = (index) => {
        const newItems = settings.navItems.filter((_, i) => i !== index);
        setSettings(prev => ({ ...prev, navItems: newItems }));
    };

    if (loading) return <div className="admin-container">Loading settings...</div>;

    return (
        <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`} style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
                    backgroundColor: toast.type === 'error' ? '#dc3545' : '#28a745',
                    color: 'white', padding: '12px 24px', borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '10px'
                }}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span style={{ fontWeight: '500' }}>{toast.message}</span>
                </div>
            )}

            {/* Header Actions */}
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1>Header Builder</h1>
                    <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.8rem' }}>
                        {lastSaved && <span>Last Saved: <b>{new Date(lastSaved).toLocaleString()}</b></span>}
                        {lastPublished && <span>Published: <b>{new Date(lastPublished).toLocaleString()}</b></span>}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-search" onClick={() => window.open('http://localhost:5173', '_blank')} disabled={saving} style={{ backgroundColor: '#007bff', width: 'auto' }}>
                        <Globe size={16} style={{ marginRight: '5px' }} /> Open Live Site
                    </button>
                    <button className="btn-search" onClick={fetchSettings} disabled={saving || loading} style={{ backgroundColor: '#17a2b8', width: 'auto' }}>
                        <RotateCcw size={16} style={{ marginRight: '5px' }} /> Refresh Data
                    </button>
                    <button className="btn-search" onClick={() => setShowHistory(!showHistory)} disabled={saving} style={{ backgroundColor: '#6c757d', opacity: saving ? 0.6 : 1 }}>
                        <History size={16} style={{ marginRight: '5px' }} /> History
                    </button>
                    <button className="btn-search" onClick={handleRevert} disabled={saving} style={{ backgroundColor: '#dc3545', opacity: saving ? 0.6 : 1 }}>
                        <RotateCcw size={16} style={{ marginRight: '5px' }} /> Discard Draft
                    </button>
                    <button className="btn-search" onClick={handleSaveDraft} disabled={saving} style={{ backgroundColor: '#ffc107', color: '#000', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                        <Save size={16} style={{ marginRight: '5px' }} /> {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button className="btn-search" onClick={handlePublish} disabled={saving} style={{ backgroundColor: '#28a745', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                        <Globe size={16} style={{ marginRight: '5px' }} /> {saving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Layout Grid - Single Column now */}
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <BrandingForm
                    settings={settings}
                    onChange={handleChange}
                    onToast={showToast}
                    setSaving={setSaving}
                />

                <NavigationForm
                    navItems={settings.navItems}
                    onEdit={handleNavEdit}
                    onDelete={handleNavDelete}
                    onAdd={handleNavAdd}
                />

                <ContactSocialsForm
                    contact={settings.contact}
                    socials={settings.socials}
                    onChange={handleNestedChange}
                />

                <CtaForm
                    cta={settings.cta}
                    onChange={handleNestedChange}
                />
            </div>

            <HistoryModal
                isOpen={showHistory}
                history={history}
                onClose={() => setShowHistory(false)}
                onRestore={handleRollback}
            />
        </div>
    );
};

export default HeaderBuilder;
