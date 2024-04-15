"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CreateToDo2 } from "./actions";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-green-600 py-1 px-2 rounded"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? "Adding" : "Add"}
    </button>
  );
}

export default function AddToDoForm() {
  const [state, formAction] = useFormState(CreateToDo2, initialState);

  return (
    <form action={formAction}>
      <input className="text-black" type="text" name="todo" />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  );
}
