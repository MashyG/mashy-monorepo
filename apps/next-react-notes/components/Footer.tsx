import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";
import { type Locales, locales } from "@/config";
import { useTranslation } from "@/app/i18n";

export async function Footer({ lng }: { lng: Locales }) {
  const { t } = await useTranslation(lng);
  return (
    <footer className="p-1">
      <Trans i18nKey="languageSwitcher" t={t}>
        Switch from <strong>{lng}</strong> to:{" "}
      </Trans>
      {locales
        .filter((l) => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && " | "}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
    </footer>
  );
}
