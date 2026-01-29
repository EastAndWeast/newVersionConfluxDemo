import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

const Auth = () => {
    const { login, connectWallet, user, loading, error } = useAuth();
    const { t } = useI18n();
    const [address, setAddress] = useState('');
    const [connecting, setConnecting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!address) return;
        try {
            await login(address);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAutoFill = async () => {
        setConnecting(true);
        try {
            const connectedAddr = await connectWallet();
            setAddress(connectedAddr);
        } catch (err) {
            alert('Failed to connect wallet: ' + err.message);
        } finally {
            setConnecting(false);
        }
    };

    if (user) {
        return (
            <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-xl)', textAlign: 'center', maxWidth: '500px', margin: 'var(--space-xl) auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
                <h3>{t('auth.success')}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                    {t('auth.successDesc')} {user.address}
                </p>
                <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {t('auth.successTip')}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-xl)', maxWidth: '500px', margin: 'var(--space-xl) auto' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('auth.welcome')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                {t('auth.desc')}
            </p>

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)', flexWrap: 'wrap', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('auth.label')}</label>
                        <button
                            type="button"
                            onClick={handleAutoFill}
                            disabled={connecting}
                            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600', padding: 0, cursor: 'pointer' }}
                        >
                            {connecting ? t('common.loading') : t('auth.autofill')}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t('auth.placeholder')}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {error && (
                    <div style={{ padding: 'var(--space-sm)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
                        {error}
                        {error.includes('Sync') && (
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                style={{ marginLeft: 'var(--space-sm)', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem' }}
                            >
                                {t('auth.sync')}
                            </button>
                        )}
                    </div>
                )}

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                    disabled={loading || !address || connecting}
                >
                    {loading ? t('auth.btnLoading') : t('auth.btn')}
                </button>
            </form>

            <div style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-lg)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {t('auth.newUser')}
                </p>
            </div>
        </div>
    );
};

export default Auth;
