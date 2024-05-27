"use client";

import { useSession } from "next-auth/react";

export default function ClientExample() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    return <div>You are not authenticated</div>;
  }
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
