import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Auth from './components/auth/Auth';
import KYC from './components/kyc/KYC';
import Wallet from './components/wallet/Wallet';
import Remit from './components/remit/Remit';
import { useAuth } from './context/AuthContext';
import { useI18n } from './context/I18nContext';

function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const { user } = useAuth();
  const { t } = useI18n();

  const renderContent = () => {
    // Force auth first
    if (!user && activeTab !== 'auth') {
      return (
        <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-xl)', textAlign: 'center', maxWidth: '500px', margin: 'var(--space-xl) auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔒</div>
          <h3>{t('app.required')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
            {t('app.requiredDesc')}
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: 'var(--space-xl)' }}
            onClick={() => setActiveTab('auth')}
          >
            {t('app.goLogin')}
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'auth':
        return <Auth />;
      case 'kyc':
        return <KYC />;
      case 'wallet':
        return <Wallet />;
      case 'remit':
        return <Remit />;
      default:
        return <Auth />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container" style={{ flex: 1, paddingBottom: 'var(--space-xl)' }}>
        {renderContent()}
      </main>

      <footer style={{ padding: 'var(--space-xl)', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: 'var(--space-xl)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          &copy; 2026 BitUnion API Simulator • Built for Demo Purposes
        </p>
      </footer>
    </div>
  );
}

export default App;
