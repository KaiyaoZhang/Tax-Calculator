import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend) // Loads translations from /public/locales/{lng}/{ns}.json
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Initializes i18next for React
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
  });

export default i18n;
