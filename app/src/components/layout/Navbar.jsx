import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

const Navbar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const { lang, t, toggleLang } = useI18n();

    const tabs = [
        { id: 'auth', label: t('nav.login') },
        { id: 'kyc', label: t('nav.kyc') },
        { id: 'wallet', label: t('nav.wallet') },
        { id: 'remit', label: t('nav.remit') },
    ];

    return (
        <nav className="glass-card" style={{ margin: 'var(--space-md)', padding: 'var(--space-sm) var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 'var(--space-md)', zIndex: 100 }}>
            <div className="nav-brand">
                <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.25rem', whiteSpace: 'nowrap', fontWeight: '800' }}>BitUnion</h2>
            </div>

            <div className="nav-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'btn-primary' : ''}
                        style={{
                            background: activeTab === tab.id ? undefined : 'rgba(255,255,255,0.03)',
                            border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
                            color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            flexShrink: 0,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="nav-actions">
                {/* Language Toggle */}
                <button
                    onClick={toggleLang}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        padding: '0.4rem 1.2rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        minWidth: '50px'
                    }}
                >
                    {lang === 'zh' ? 'En' : '中'}
                </button>

                {user && (
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.4rem 1rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ff4d4d',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            fontWeight: '600'
                        }}
                    >
                        {t('nav.logout')}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
