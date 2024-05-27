"use server";

import { redirect } from "next/navigation";
import { addNote, updateNote, delNote } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "请输入标题" }),
  content: z
    .string()
    .min(1, { message: "请输入内容" })
    .max(100, { message: "内容不能超过100个字符" }),
});

export async function saveNote(prevState: any, formData: FormData) {
  const noteId = (formData.get("noteId") as string) || "";

  const title = formData.get("title");
  const body = formData.get("body");

  const data = {
    title,
    content: body,
    updateTime: new Date(),
  };

  // 校验数据
  const result = schema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.issues };
  }

  // 为了让效果更明显
  await sleep(2000);

  if (noteId) {
    await updateNote(noteId, JSON.stringify(data));
    revalidatePath("/", "layout");
  } else {
    await addNote(JSON.stringify(data));
    revalidatePath("/", "layout");
  }
  return { message: `Add Success!` };
}

export async function deleteNote(prevState: any, formData: FormData) {
  const noteId = (formData.get("noteId") as string) || "";
  await delNote(noteId);
  revalidatePath("/", "layout");
  redirect("/");
}
