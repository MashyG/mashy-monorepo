import dayjs from "dayjs";

type NoteItemHeaderProps = {
  title: string;
  updateTime: string;
};
export default function SideNoteItemHeader({
  title,
  updateTime,
}: NoteItemHeaderProps) {
  return (
    <header className="sidebar-note-header">
      <strong>{title}</strong>
      <small>{dayjs(updateTime).format("YYYY-MM-DD hh:mm:ss")}</small>
    </header>
  );
}
