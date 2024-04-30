import Redis from "ioredis";

const redis = new Redis();

const initialData = {
  "001":
    '{"title":"title1","content":"content1","updateTime":"2023-12-13T09:19:48.837Z"}',
  "002":
    '{"title":"title2","content":"content2","updateTime":"2023-12-14T11:19:48.837Z"}',
  "003":
    '{"title":"title3","content":"content3","updateTime":"2023-12-15T13:19:48.837Z"}',
};
export async function getAllNotes() {
  const data = await redis.hgetall("notes");
  if (Object.keys(data).length == 0) {
    await redis.hset("notes", initialData);
  }
  return await redis.hgetall("notes");
}

export async function addNote(data: any) {
  const uuid = Date.now().toString();
  await redis.hset("notes", [uuid], data);
  return uuid;
}

export async function updateNote(uuid: string, data: any) {
  await redis.hset("notes", [uuid], data);
}

export async function getNote(uuid: string) {
  return JSON.parse((await redis.hget("notes", uuid)) || "");
}

export async function delNote(uuid: string) {
  return await redis.hdel("notes", uuid);
}

export default redis;
