import React, { useState, useEffect } from 'react';
import { kycApi } from '../../api';
import { mockOcrData } from '../../utils/mockData';
import { useI18n } from '../../context/I18nContext';

const KYC = () => {
    const { t } = useI18n();
    const [fiatType, setFiatType] = useState('USD');
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchFields();
        fetchStatus();
    }, [fiatType]);

    const fetchFields = async () => {
        try {
            const data = await kycApi.getKycFields(fiatType);
            setFields(data.fields || []);
            // Initialize form data with empty strings for all fields
            const initialData = {};
            data.fields.forEach(f => initialData[f] = '');
            setFormData(prev => ({ ...initialData, ...prev }));
        } catch (err) {
            console.error('Failed to fetch fields', err);
        }
    };

    const fetchStatus = async () => {
        try {
            const data = await kycApi.getKycStatus(fiatType);
            setStatus(data);
        } catch (err) {
            console.error('Failed to fetch status', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const { url } = await kycApi.uploadKycFile(fd);
            setFormData({ ...formData, [fieldName]: url });
            alert(`${t('common.success')}: ${fieldName}`);
        } catch (err) {
            alert(t('common.error'));
        } finally {
            setUploading(false);
        }
    };

    const simulateOcr = () => {
        const newData = { ...formData };
        fields.forEach(field => {
            // Find a match in mockData regardless of case
            const mockKey = Object.keys(mockOcrData).find(
                k => k.toLowerCase() === field.toLowerCase()
            );
            if (mockKey) {
                newData[field] = mockOcrData[mockKey];
            }
        });
        setFormData(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Filter form data to only include fields requested by the API
            const submissionData = { fiat: fiatType };
            fields.forEach(field => {
                submissionData[field] = formData[field] || '';
            });

            await kycApi.setUserKyc(submissionData);
            alert(t('kyc.success'));
            fetchStatus();
        } catch (err) {
            console.error('KYC Submission Error Details:', err.response?.data || err);
            const errorMsg = err.response?.data?.message || err.message;
            alert(t('common.error') + ': ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h2 style={{ marginBottom: 'var(--space-xs)' }}>{t('kyc.title')}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('kyc.desc')}</p>
                    </div>
                    <select
                        value={fiatType}
                        onChange={(e) => setFiatType(e.target.value)}
                        style={{ padding: '0.5rem', background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start' }}
                    >
                        <option value="USD">USD</option>
                        <option value="CNY">CNY</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>

                {status && (
                    <div style={{ padding: 'var(--space-md)', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: 'var(--space-xl)', display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('kyc.status.info')}</div>
                            <div style={{ color: status.infoCompleted ? 'var(--accent)' : 'var(--warning)', fontWeight: '600' }}>
                                {status.infoCompleted ? t('kyc.status.completed') : t('kyc.status.incomplete')}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('kyc.status.photo')}</div>
                            <div style={{ color: status.photoCompleted ? 'var(--accent)' : 'var(--warning)', fontWeight: '600' }}>
                                {status.photoCompleted ? t('kyc.status.completed') : t('kyc.status.incomplete')}
                            </div>
                        </div>
                        {status.missingInfo?.length > 0 && (
                            <div style={{ flex: '1 1 100%' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('kyc.status.missing')}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--error)' }}>{status.missingInfo.join(', ')}</div>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={simulateOcr}
                        style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', border: '1px dashed var(--accent)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
                    >
                        {t('kyc.ocrBtn')}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
                        {fields.map(field => {
                            const isPhoto = field.toLowerCase().includes('photo');
                            return (
                                <div key={field}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </label>
                                    {isPhoto ? (
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileUpload(e, field)}
                                                style={{ display: 'none' }}
                                                id={`file-${field}`}
                                            />
                                            <label
                                                htmlFor={`file-${field}`}
                                                style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-secondary)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                {uploading ? t('kyc.uploading') : formData[field] ? t('kyc.change') : t('kyc.upload')}
                                            </label>
                                            {formData[field] && (
                                                <div style={{ width: '40px', height: '40px', background: `url(${formData[field]}) center/cover`, borderRadius: '4px' }} title="Preview"></div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            name={field}
                                            value={formData[field] || ''}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', boxSizing: 'border-box' }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: 'var(--space-xl)' }}
                        disabled={loading || uploading}
                    >
                        {loading ? t('kyc.submitting') : t('kyc.submitBtn')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KYC;
