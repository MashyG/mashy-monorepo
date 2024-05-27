import SidebarNoteListFilter from "@/components/SidebarNoteListFilter";
import SidebarNoteItemHeader from "@/components/SidebarNoteItemHeader";
import { getAllNotes } from "@/lib/prisma";
import { sleep } from "@/lib";
import { Suspense } from "react";

export default async function NoteList() {
  await sleep(2 * 1000);

  const notes = await getAllNotes();

  return (
    <Suspense>
      <SidebarNoteListFilter
        notes={Object.entries(notes).map(([noteId, note]) => {
          const noteData = JSON.parse(note);
          return {
            noteId,
            note: noteData,
            header: (
              <SidebarNoteItemHeader
                title={noteData.title}
                updateTime={noteData.updateTime}
              />
            ),
          };
        })}
      />
    </Suspense>
  );
}
