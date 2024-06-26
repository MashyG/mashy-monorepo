"use client";

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type NoteContentProps = {
  id: string;
  title: string;
  children: ReactNode;
  expandedChildren: ReactNode;
};
export default function SidebarNoteContent({
  id,
  title,
  children,
  expandedChildren,
}: NoteContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedId = pathname?.split("/")[1] || null;

  const [isPending] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = id === selectedId;

  // Animate after title is edited.
  const itemRef: any = useRef(null);
  const prevTitleRef: any = useRef(title);

  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title;
      itemRef.current.classList.add("flash");
    }
  }, [title]);

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        itemRef.current.classList.remove("flash");
      }}
      className={[
        "sidebar-note-list-item",
        isExpanded ? "note-expanded" : "",
      ].join(" ")}
    >
      {children}
      <button
        className="sidebar-note-open"
        style={{
          backgroundColor: isPending
            ? "var(--gray-80)"
            : isActive
            ? "var(--tertiary-blue)"
            : "",
          border: isActive
            ? "1px solid var(--primary-border)"
            : "1px solid transparent",
        }}
        onClick={() => {
          router.push(`/note/${id}`);
        }}
      ></button>
      <button
        className="sidebar-note-toggle-expand"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? (
          <img
            src="/chevron-down.svg"
            width="10px"
            height="10px"
            alt="Collapse"
          />
        ) : (
          <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  );
}
