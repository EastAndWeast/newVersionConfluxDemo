import React, { useState, useEffect } from 'react';
import { remitApi, userApi } from '../../api';
import { useI18n } from '../../context/I18nContext';

const Remit = () => {
    const { t } = useI18n();
    const [supported, setSupported] = useState(null);
    const [fromToken, setFromToken] = useState('USDT');
    const [toFiat, setToFiat] = useState('USD');
    const [amount, setAmount] = useState('100');
    const [price, setPrice] = useState(null);
    const [limit, setLimit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [balance, setBalance] = useState('0.00');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (fromToken && toFiat) {
            updatePrice();
            updateLimit();
        }
    }, [fromToken, toFiat]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [suppData, balData] = await Promise.all([
                remitApi.getSupportedExchange('WASABIDESK'),
                userApi.getBalance()
            ]);
            setSupported(suppData);

            // Set balance for selected token
            const bal = balData[fromToken]?.finalized || '0.00';
            setBalance(bal);
        } catch (err) {
            console.error('Failed to fetch initial remit data', err);
        } finally {
            setLoading(false);
        }
    };

    const updatePrice = async () => {
        setPrice(null); // Clear old price to show loading/updating
        try {
            const [tokenData, fiatData] = await Promise.all([
                remitApi.getPrice({ token: fromToken }),
                remitApi.getPrice({ fiat: toFiat })
            ]);

            const tokenInUsd = parseFloat(tokenData.currencyPriceInUSD || '0');
            const usdToFiat = parseFloat(fiatData.usdPriceInCurrency || '0');

            if (tokenInUsd > 0 && usdToFiat > 0) {
                const rate = (tokenInUsd * usdToFiat).toFixed(4);
                setPrice({ price: rate });
            } else {
                setPrice({ price: '1.0000' }); // Fallback for test env
            }
        } catch (err) {
            console.error('Price update failed', err);
            setPrice({ price: '0.0000' });
        }
    };

    const updateLimit = async () => {
        try {
            const data = await remitApi.getExchangeLimit({ fiatType: toFiat, bankType: 'WASABIDESK' });
            setLimit(data);
        } catch (err) {
            console.error('Limit update failed', err);
        }
    };

    const handleExchange = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) > parseFloat(balance)) {
            alert('Insufficient balance');
            return;
        }

        setSubmitting(true);
        try {
            const traceID = Date.now().toString() + '-' + Math.random().toString(36).slice(2, 9);
            const order = await remitApi.createExchangeOrder({
                amount,
                bankType: 'WASABIDESK',
                fromToken,
                toFiat,
                traceID,
                refPrice: price?.price || '1.0'
            });

            alert(`${t('common.success')}! ID: ${order.internalOrderID}`);
            fetchInitialData(); // Refresh balance
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            alert(`${t('common.error')}: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>{t('common.loading')}</div>;

    const estimatedOutput = price ? (parseFloat(amount) * parseFloat(price.price)).toFixed(2) : '0.00';

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: 'var(--space-xl) auto' }}>
            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('remit.title')}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>
                    {t('remit.desc')}
                </p>

                <form onSubmit={handleExchange}>
                    {/* From Token Section */}
                    <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('remit.pay')}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('remit.balance')} {balance} {fromToken}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', outline: 'none', minWidth: '0' }}
                            />
                            <select
                                value={fromToken}
                                onChange={(e) => setFromToken(e.target.value)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-primary)',
                                    color: 'white',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '600',
                                    outline: 'none'
                                }}
                            >
                                {supported?.supportedTokens?.map(t => (
                                    <option key={t.token} value={t.token} style={{ background: '#1e293b', color: 'white' }}>{t.token}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-1rem 0', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '4px solid var(--bg-primary)' }}>
                            ↓
                        </div>
                    </div>

                    {/* To Fiat Section */}
                    <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', flexWrap: 'wrap', gap: '4px' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('remit.receiveLabel')}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                                {price ? `${t('remit.rate')} 1 ${fromToken} = ${price.price} ${toFiat}` : t('remit.updating')}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <div style={{ flex: 1, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{estimatedOutput}</div>
                            <select
                                value={toFiat}
                                onChange={(e) => setToFiat(e.target.value)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-primary)',
                                    color: 'white',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '600',
                                    outline: 'none'
                                }}
                            >
                                {supported?.supportedFiats?.map(f => (
                                    <option key={f.fiat} value={f.fiat} style={{ background: '#1e293b', color: 'white' }}>{f.fiat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Limits Info */}
                    {limit && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)', textAlign: 'center', lineHeight: '1.6' }}>
                            <div style={{ opacity: 0.8 }}>{t('remit.min')} <span style={{ color: 'white' }}>{limit.minExchangeAmount || '0.00'} {toFiat}</span></div>
                            <div style={{ opacity: 0.8 }}>{t('remit.max')} <span style={{ color: 'white' }}>{limit.maxExchangeAmount || '∞'} {toFiat}</span></div>
                            <div style={{ opacity: 0.8 }}>{t('remit.daily')} <span style={{ color: 'var(--accent)' }}>{limit.exchangeFiatLimit || '0.00'} {toFiat}</span></div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                        disabled={submitting || !amount || parseFloat(amount) <= 0}
                    >
                        {submitting ? t('remit.processing') : t('remit.btn')}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                    <h4 style={{ color: 'var(--warning)', fontSize: '0.875rem', marginBottom: 'var(--space-xs)' }}>{t('remit.note')}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {t('remit.noteDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Remit;
