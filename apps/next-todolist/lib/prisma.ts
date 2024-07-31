import { encryptData, toStr } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export let prisma: PrismaClient = null as any;

if (!prisma) {
  prisma = new PrismaClient();
}

// Get User
export async function getUsers() {
  const list = await prisma.user.findMany({
    // where: {
    //   authorId: session?.user?.userId, // TODO
    // },
  });
  return NextResponse.json({
    list,
  });
}
// Get User By username
export async function getToken(data: { username: string; password: string }) {
  const { username, password } = data || {};
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  const { id, password: userPassword, type, status } = user || {};
  if (!id || userPassword !== password) {
    return NextResponse.json(
      {
        code: 401,
        error: "用户名或密码错误",
      },
      { status: 401 }
    );
  }

  const token = encryptData(
    toStr({
      id,
      username,
      type,
      status,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  );
  return NextResponse.json({
    token,
  });
}

// Create User
export async function createUser(params: any) {
  const data = {
    ...params,
    status: "1",
  };
  const res = await prisma.user.create({ data });
  const { id, username, status, type } = res || {};

  return NextResponse.json({
    id,
    username,
    status,
    type,
  });
}
