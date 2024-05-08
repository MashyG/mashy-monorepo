import { createInstance } from "i18next";
// 帮助我们读取 json 文件资源，生成字典。
import resourcesToBackend from "i18next-resources-to-backend";
// 在浏览器端自动检测语言
import { initReactI18next } from "react-i18next/initReactI18next";
import { type Locales, locales, defaultLocale } from "@/config";

const initI18next = async (lng: Locales = defaultLocale, ns = "basic") => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: Locales, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      // debug: true,
      supportedLngs: locales,
      fallbackLng: defaultLocale,
      lng,
      fallbackNS: "basic",
      defaultNS: "basic",
      ns,
    });
  return i18nInstance;
};

export async function useTranslation(
  lng: Locales,
  ns = "basic",
  options = { keyPrefix: "" }
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}
