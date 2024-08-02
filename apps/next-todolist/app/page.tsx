"use client";

import { redirect } from "next/navigation";

export default function Home() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    redirect("/login");
  } else {
    redirect("/home");
  }
}
