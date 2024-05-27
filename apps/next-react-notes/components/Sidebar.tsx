import React, { Suspense } from "react";
import Link from "next/link";
import SidebarNoteList from "@/components/SidebarNoteList";
import EditButton from "./EditButton";
import NoteListSkeleton from "./NoteListSkeleton";
import SidebarSearchField from "./SidebarSearchField";
import { type Locales } from "@/config";
import { useTranslation } from "@/app/i18n";
import { Footer } from "./Footer";
import SidebarImport from "./SidebarImport";
import Header from "./Header";

export default async function Sidebar({ lng }: { lng: Locales }) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <section className="px-2 bg-white shadow-lg z-[1000] w-1/3 max-w-80 min-w-64 p-2 flex flex-col">
        <Header />

        <Link href={"/"}>
          <section className="flex py-2 items-center tracking-widest uppercase">
            <img className="w-6 h-6 mr-2" src="/logo.svg" role="presentation" />
            <strong>{t("title")}</strong>
          </section>
        </Link>
        <section role="menubar">
          <SidebarSearchField lng={lng} />
          <div className="flex items-center pt-2">
            <EditButton noteId={null}>{t("new")}</EditButton>
            <SidebarImport lng={lng} />
          </div>
        </section>

        <nav className="overflow-auto">
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
        <Footer lng={lng} />
      </section>
    </>
  );
}
