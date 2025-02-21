import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../../public/locales/en/translation.json";
import frTranslation from "../../public/locales/fr/translation.json";

i18n.use(initReactI18next).init({
  lng: "en", // Default test language
  fallbackLng: "en",
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
