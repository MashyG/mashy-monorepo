"use server";

import { revalidatePath } from "next/cache";

const data = ["阅读", "写作", "冥想"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GetToDos() {
  return data;
}

export async function CreateToDo(formData: FormData) {
  await sleep(500);
  const todo = (formData.get("todo") as string) ?? "";
  data.push(todo);
  revalidatePath("/todo");
  return data;
}

export async function CreateToDoByButton(value: string) {
  const form = new FormData();
  form.append("todo", value);
  await sleep(2000);
  return CreateToDo(form);
}

export async function CreateToDo2(prevState: any, formData: FormData) {
  await sleep(500);
  const todo = (formData.get("todo") as string) ?? "";
  data.push(todo);
  revalidatePath("/todo");
  return {
    message: `add ${todo} success!`,
  };
}
