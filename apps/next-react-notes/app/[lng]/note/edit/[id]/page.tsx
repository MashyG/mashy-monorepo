import NoteEditor from "@/components/NoteEditor";
import { getNote } from "@/lib/prisma";

type EditPageProps = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params }: EditPageProps) {
  const noteId = params.id;
  const note = await getNote(noteId);

  if (note === null) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    );
  }

  return (
    <NoteEditor
      noteId={noteId}
      initialTitle={note?.title ?? ""}
      initialBody={note?.content ?? ""}
    />
  );
}
