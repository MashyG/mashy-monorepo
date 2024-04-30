export default function NoteListSkeleton() {
  const skeletons = new Array(5).fill(1);

  return (
    <div>
      <ul className="notes-list skeleton-container">
        {skeletons.map(() => {
          return (
            <li className="v-stack" key={Math.random()}>
              <div
                className="sidebar-note-list-item skeleton"
                style={{ height: "5em" }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
