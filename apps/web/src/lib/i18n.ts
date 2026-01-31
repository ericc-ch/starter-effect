import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpBackend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

i18next
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: false,
    load: "languageOnly",

    supportedLngs: ["en"],
    fallbackLng: "en",
  })
  .catch((err: unknown) => {
    console.error("i18next initialization failed:", err)
  })
