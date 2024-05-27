import { PrismaClient } from "@prisma/client";
import { auth } from "auth";

// 为了避免开发环境下建立多个 Prisma Client 实例导致问题
const globalForPrisma: any = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getAllNotes() {
  const session = await auth();
  if (session == null) return [];

  // 查找登录用户的笔记
  const notes = await prisma.note.findMany({
    where: {
      authorId: session?.user?.id ?? session?.user?.name ?? "",
    },
  });
  // 构造返回数据
  const res: Record<string, string> = {};
  notes.forEach(({ title, content, id, updatedAt }: any) => {
    res[id] = JSON.stringify({
      title,
      content,
      updateTime: updatedAt,
    });
  });
  return res;
}

export async function addNote(data: string) {
  const session = await auth();
  const { title, content } = JSON.parse(data);
  const newNote = {
    title,
    content,
    author: {
      connect: {
        // 关联用户
        id: session?.user?.id ?? session?.user?.name ?? "",
      },
    },
  };
  const result = await prisma.note.create({
    data: newNote,
  });

  return result.id;
}

export async function updateNote(uuid: string, data: string) {
  const parsedData = JSON.parse(data);
  await prisma.note.update({
    where: {
      id: uuid,
    },
    data: {
      title: parsedData.title,
      content: parsedData.content,
    },
  });
}

export async function getNote(uuid: string) {
  const session = await auth();
  if (session == null) return;
  const resData =
    (await prisma.note.findFirst({
      where: {
        id: uuid,
        authorId: session?.user?.id ?? session?.user?.name ?? "",
      },
    })) ?? null;

  if (!resData) return;

  const { title, content, updateTime, id } = resData;
  return {
    title,
    content,
    updateTime,
    id,
  };
}

export async function delNote(uuid: string) {
  await prisma.note.delete({
    where: {
      id: uuid,
    },
  });
}

export async function addUser(username: string, password: string) {
  const user = await prisma.user.create({
    data: {
      username,
      password, // TODO: 密码需要加密
      notes: {
        create: [], // 创建空的 Notes
      },
    },
  });

  return {
    name: username,
    username,
    userId: user.id,
  };
}

export async function getUser(username: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      notes: true, // 是否返回 Notes 表中的信息
    },
  });
  if (!user) return 0;
  if (user.password !== password) return 1;
  return {
    name: username,
    username,
    userId: user.id,
  };
}

export default prisma;
