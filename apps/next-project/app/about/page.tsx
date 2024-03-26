"use client";
import { usePathname } from "next/navigation";
import { use } from "react";

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    message: "Hello, About!",
  };
}
export default function About() {
  // const { message } = await getData();
  console.log("About page", usePathname());
  const { message } = use(getData());
  return <h1>{message}</h1>;
}
