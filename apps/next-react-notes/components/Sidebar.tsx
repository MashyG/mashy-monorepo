import React, { Suspense } from "react";
import Link from "next/link";
import SidebarNoteList from "@/components/SidebarNoteList";
import EditButton from "./EditButton";
import NoteListSkeleton from "./NoteListSkeleton";
import SidebarSearchField from "./SidebarSearchField";

export default async function Sidebar() {
  return (
    <>
      <section className="bg-white shadow-lg z-[1000] w-1/3 max-w-80 min-w-64 p-2 flex flex-col">
        <Link href={"/"}>
          <section className="flex p-4 items-center tracking-widest uppercase">
            <img className="w-6 h-6 mr-2" src="/logo.svg" role="presentation" />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section
          className="px-2 flex items-center justify-between"
          role="menubar"
        >
          <SidebarSearchField />
          <EditButton noteId={null}>New</EditButton>
        </section>

        <nav className="overflow-auto">
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
      </section>
    </>
  );
}
