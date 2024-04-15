import { Suspense } from "react";
import { GetToDos, CreateToDo } from "./actions";
import Button from "./Button";
import AddToDoForm from "./AddToDoForm";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function List() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = (await res.json()).slice(0, 10);
  await sleep(5 * 1000);
  return (
    <ul>
      {data.map(
        ({ title, id }: { title: string; id: string }, index: number) => {
          return (
            <li key={id} className="text-gray-400">
              {index + 1}. {title}
            </li>
          );
        }
      )}
    </ul>
  );
}

async function TodoForm() {
  const todos = await GetToDos();
  return (
    <div className="p-4 rounded bg-blue-400">
      <form action={CreateToDo}>
        <input className="text-black" type="text" name="todo" />
        <button className="bg-blue-600 py-1 px-2 rounded ml-2" type="submit">
          Submit
        </button>
        <Button>添加自定义实践</Button>
      </form>
      <ul>
        {todos.map((todo: string, i: number) => (
          <li key={i}>
            {i + 1}. {todo}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function TodoFormList() {
  const todos = await GetToDos();
  return (
    <>
      <AddToDoForm />
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>拼命加载中...</div>}>
      <List />
      <div className="m-2 text-red-600">=========== TodoForm ===========</div>
      <TodoForm />
      <div className="m-2 text-red-600">
        ============ TodoFormList ==========
      </div>
      <TodoFormList />
    </Suspense>
  );
}
