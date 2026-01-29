import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

const Wallet = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [balances, setBalances] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mockDeposits, setMockDeposits] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [balData, txnData] = await Promise.all([
                userApi.getBalance(),
                userApi.getTransactions({ page: 1, limit: 10, startAt: 1577836800, endAt: Math.floor(Date.now() / 1000) })
            ]);
            setBalances(balData || {});
            setTransactions(txnData.items || []);
        } catch (err) {
            console.error('Failed to fetch wallet data', err);
        } finally {
            setLoading(false);
        }
    };

    const simulateDeposit = () => {
        const amount = '100.00';
        const token = 'USDT';
        const newMock = {
            id: Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            category: 'DEPOSIT',
            DEPOSIT: {
                txnAmount: amount,
                txnToken: token,
                status: 'SUCCESS',
                chain: 'espace-mainnet',
                txHash: '0x' + Math.random().toString(16).slice(2, 66)
            }
        };

        setMockDeposits([newMock, ...mockDeposits]);

        // Simulate balance update in UI
        const currentBal = balances[token] ? parseFloat(balances[token].finalized) : 0;
        setBalances({
            ...balances,
            [token]: {
                ...balances[token],
                finalized: (currentBal + parseFloat(amount)).toFixed(2)
            }
        });

        alert(t('common.success'));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>{t('common.loading')}</div>;

    const tokens = ['USDT', 'USDC', 'CFX', 'USDT0'];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
                {/* Left Column: Balances and Deposit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('wallet.balances')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {tokens.map(token => (
                                <div key={token} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{token[0]}</div>
                                        <span style={{ fontWeight: '500' }}>{token}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '600' }}>{balances[token]?.finalized || '0.00'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>≈ ${(parseFloat(balances[token]?.finalized || 0) * 1.0).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--primary)' }}>
                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>{t('wallet.receive')}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                            {t('wallet.receiveDesc')}
                        </p>

                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>{t('wallet.addrLabel')}</div>
                            <div style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500' }}>{user.address}</div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)', padding: '0.8rem' }}
                            onClick={simulateDeposit}
                        >
                            {t('wallet.mockBtn')}
                        </button>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="glass-card" style={{ padding: 'var(--space-lg)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h3>{t('wallet.history')}</h3>
                        <button onClick={fetchData} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem' }}>{t('wallet.refresh')}</button>
                    </div>

                    <div style={{ maxHeight: '600px', overflowX: 'auto' }}>
                        {[...mockDeposits, ...transactions].length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>{t('wallet.empty')}</div>
                        ) : (
                            <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: 'var(--space-sm) 0' }}>{t('wallet.table.type')}</th>
                                        <th>{t('wallet.table.amount')}</th>
                                        <th>{t('wallet.table.status')}</th>
                                        <th>{t('wallet.table.date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...mockDeposits, ...transactions].map((txn, idx) => {
                                        const data = txn[txn.category] || {};
                                        return (
                                            <tr key={txn.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                                <td style={{ padding: 'var(--space-md) 0' }}>
                                                    <div style={{ fontWeight: '500' }}>{txn.category}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{data.chain || 'Internal'}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{data.txnAmount || data.fromAmount || '-'} {data.txnToken || data.fromToken || ''}</div>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        background: (data.status === 'SUCCESS' || txn.category === 'DEPOSIT') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: (data.status === 'SUCCESS' || txn.category === 'DEPOSIT') ? 'var(--accent)' : 'var(--warning)',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        {data.status || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    {new Date(txn.timestamp * 1000).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
