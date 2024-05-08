import { type Locales } from "@/config";
import { useTranslation } from "../i18n";

type Props = {
  params: {
    lng: Locales;
  };
};
export default async function Home({ params: { lng } }: Props) {
  const { t } = await useTranslation(lng);
  return (
    <div className="note--empty-state">
      <span className="note-text--empty-state">{t("initText")}</span>
    </div>
  );
}
