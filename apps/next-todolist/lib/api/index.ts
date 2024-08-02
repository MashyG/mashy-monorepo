import { toStr } from "@/utils";

export const login = async (data: { username: string; password: string }) => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: toStr(data),
  });
  const { status } = res || {};
  if (status !== 200) {
    throw res;
  }
  return res;
};

export const getUsers = async () => {
  return await fetch("/api/user");
};
export const addUser = async (data: any) => {
  return await fetch("/api/user", {
    method: "POST",
    body: toStr(data),
  });
};
