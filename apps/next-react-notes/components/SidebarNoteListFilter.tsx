"use client";

import { useSearchParams } from "next/navigation";
import SidebarNoteItemContent from "@/components/SidebarNoteItemContent";

type SidebarNoteListProps = Readonly<{
  notes: Array<{
    noteId: string;
    note: {
      title: string;
      content: string;
    };
    header: React.ReactNode;
  }>;
}>;

function ExpandedChildren(content: string) {
  return (
    <p className="sidebar-note-excerpt">
      {content?.substring(0, 20) || <i>(No content~)</i>}
    </p>
  );
}

export default function SidebarNoteListFilter({ notes }: SidebarNoteListProps) {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q");

  const showNotes = notes
    .map((noteItem) => {
      const { noteId, note, header } = noteItem;
      if (
        !searchText ||
        (searchText &&
          note.title.toLowerCase().includes(searchText.toLowerCase()))
      ) {
        return (
          <SidebarNoteItemContent
            key={noteId}
            id={noteId}
            title={note.title}
            expandedChildren={ExpandedChildren(note.content)}
          >
            {header}
          </SidebarNoteItemContent>
        );
      }

      return null;
    })
    .filter((i) => i);

  if (showNotes.length == 0) {
    return (
      <div className="p-4 text-gray-400 text-center">
        {"No notes created yet!"}
      </div>
    );
  }

  return (
    <ul className="notes-list">{showNotes.map((noteItem) => noteItem)}</ul>
  );
}
