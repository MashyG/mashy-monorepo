"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SidebarSearchField() {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q") ?? "";

  const { replace } = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // 非常适合在这种频繁非紧急的更新中使用，有效防止造成阻塞
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="search" role="search">
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder="Search"
        type="text"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
