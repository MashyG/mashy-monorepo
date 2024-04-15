"use client";

import { useOptimistic } from "react";
import { useFormState } from "react-dom";
import { createToDo } from "./actions";

export default function Form({ todos }: { todos: Array<string> }) {
  const [state, sendFormAction] = useFormState(createToDo, { message: "" });

  const [optimistiToDos, addOptimisticTodo] = useOptimistic(
    todos.map((i) => ({ text: i })),
    (state: Array<string>, newTodo: string) => [
      ...state,
      {
        text: newTodo,
        sending: true,
      },
    ]
  );

  async function formAction(formData: FormData) {
    addOptimisticTodo(formData.get("todo"));
    await sendFormAction(formData);
  }

  console.log(optimistiToDos);

  return (
    <>
      <form action={formAction}>
        <input className="text-black" type="text" name="todo" />
        <button className="bg-green-600 py-1 px-2" type="submit">
          Add
        </button>
        <p aria-live="polite" className="sr-only">
          {state?.message}
        </p>
      </form>
      <ul>
        {optimistiToDos.map(({ text, sending }: any, i: number) => (
          <li key={i}>
            {text}
            {!!sending && <small> (Sending...)</small>}
          </li>
        ))}
      </ul>
    </>
  );
}
