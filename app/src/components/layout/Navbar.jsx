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
                <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>BitUnion</h2>
            </div>

            <div className="nav-tabs" style={{ display: 'flex', gap: 'var(--space-sm)', marginLeft: 'var(--space-md)', flexGrow: 1 }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'btn-primary' : ''}
                        style={{
                            background: activeTab === tab.id ? undefined : 'transparent',
                            border: 'none',
                            color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            flexShrink: 0
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginLeft: 'var(--space-md)' }}>
                {/* Language Toggle */}
                <button
                    onClick={toggleLang}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        minWidth: '40px'
                    }}
                >
                    {lang === 'zh' ? 'En' : '中'}
                </button>

                {user && (
                    <button
                        onClick={logout}
                        style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                        {t('nav.logout')}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
