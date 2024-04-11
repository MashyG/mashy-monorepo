import { Suspense } from "react";

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

export default function Page() {
  return (
    <Suspense fallback={<div>拼命加载中...</div>}>
      <List />
    </Suspense>
  );
}
