"use client";

import { useEffect, useState } from "react";
import NotePreview from "@/components/NotePreview";
import SaveButton from "@/components/SaveButton";
import DeleteButton from "@/components/DeleteButton";
import { useFormState } from "react-dom";
import { deleteNote, saveNote } from "@/app/action";

type NoteEditorProps = {
  noteId: string;
  initialTitle: string;
  initialBody: string;
};

const initialState = {
  message: "",
};

export default function NoteEditor({
  noteId,
  initialTitle,
  initialBody,
}: NoteEditorProps) {
  const [saveState, saveFormAction] = useFormState(saveNote, initialState);
  const [_, delFormAction] = useFormState(deleteNote, null);

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  const isDraft = !noteId;

  return (
    <div className="note-editor">
      <form className="note-editor-form" autoComplete="off">
        <div className="note-editor-menu" role="menubar">
          <input type="hidden" name="noteId" value={noteId} />
          <SaveButton formAction={saveFormAction} />
          <DeleteButton isDraft={isDraft} formAction={delFormAction} />
        </div>
        <div className="note-editor-menu">
          <span className="text-green-500">{saveState?.message ?? ""}</span>
          <span className="text-red-500">
            {saveState.errors && (saveState.errors[0].message ?? "")}
          </span>
        </div>
        <label className="offscreen" htmlFor="note-title-input">
          Enter a title for your note
        </label>
        <input
          id="note-title-input"
          type="text"
          name="title"
          value={title}
          placeholder="please input title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label className="offscreen" htmlFor="note-body-input">
          Enter the body for your note
        </label>
        <textarea
          name="body"
          value={body}
          id="note-body-input"
          placeholder="please input content"
          onChange={(e) => setBody(e.target.value)}
        />
      </form>
      <div className="note-editor-preview">
        <div className="label label--preview" role="status">
          Preview
        </div>
        <h1 className="note-title">{title}</h1>
        <NotePreview>{body}</NotePreview>
      </div>
    </div>
  );
}
