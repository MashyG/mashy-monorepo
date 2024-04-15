"use client";
import { useFormStatus } from "react-dom";

import { CreateToDoByButton } from "./actions";

export default function Button({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-green-600 py-1 px-2 rounded"
      onClick={async () => {
        const data = await CreateToDoByButton("运动");
        alert(JSON.stringify(data));
      }}
    >
      {pending ? <>waiting...</> : children}
    </button>
  );
}
