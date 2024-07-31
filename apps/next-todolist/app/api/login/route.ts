import { getToken } from "@/lib/prisma";

// POST /api/login
export async function POST(req: Request) {
  const data = await req.json();
  return await getToken(data);
}
