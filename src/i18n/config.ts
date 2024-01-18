import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translation_en from './en.json';
import translation_zh from './zh.json';

const resources = {
    en: {
        translation: translation_en,
    },
    zh: {
        translation: translation_zh,
    },
};

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instanceuse(initReactI18next)
    .init({
    resources,
    // 默认语言  zh/en  中文/英文
    lng: 'zh',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;