import { findToDos } from "./actions";
import Form from "./Form";

export default async function Page() {
  const todos = await findToDos();
  return <Form todos={todos} />;
}
