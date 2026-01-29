import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('bitunion_lang') || 'zh');

    useEffect(() => {
        localStorage.setItem('bitunion_lang', lang);
    }, [lang]);

    const t = (path) => {
        const keys = path.split('.');
        let value = translations[lang];
        for (const key of keys) {
            value = value?.[key];
        }
        return value || path;
    };

    const toggleLang = () => {
        setLang(prev => (prev === 'zh' ? 'en' : 'zh'));
    };

    return (
        <I18nContext.Provider value={{ lang, t, toggleLang }}>
            {children}
        </I18nContext.Provider>
    );
};
