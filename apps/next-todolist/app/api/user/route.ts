import { createUser, getUsers } from "@/lib/prisma";

// GET /api/user
export async function GET() {
  const res = await getUsers();
  return res;
}

// POST /api/user
export async function POST(req: Request) {
  const data = await req.json();
  const res = await createUser(data);
  return res;
}
