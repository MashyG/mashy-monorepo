"use client";

import { importNote } from "@/app/actions";
import { useTranslation } from "@/app/i18n/client";
import { Locales } from "@/config";
import { useRouter } from "next/navigation";
import React from "react";

export default function SidebarImport({ lng }: { lng: Locales }) {
  const { t } = useTranslation(lng);

  const router = useRouter();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await importNote(formData);
      router.push(`/note/${data.uid}`);
    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    e.target.type = "text";
    e.target.type = "file";
  };

  return (
    <div className="ml-2">
      <label
        htmlFor="file"
        className="cursor-pointer border border-solid border-gray-300 hover:opacity-80 rounded-full px-4 py-2"
      >
        {t("uploadFile")}
      </label>
      <input
        type="file"
        id="file"
        name="file"
        style={{ position: "absolute", clip: "rect(0 0 0 0)" }}
        onChange={onChange}
        accept=".md"
      />
    </div>
  );
}
